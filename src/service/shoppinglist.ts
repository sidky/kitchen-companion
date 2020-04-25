// import logger from "../common/logger";

import {pool} from "../storage/postgres"
import {logger} from "../common/logger";
import {ShoppingListFilter} from "./shoppinglist/filter";
import {ShoppingItem} from "../model/shoppingitem";
import {ItemFulfilmentState} from "../model/fulfilmentstate";
import {Pool, PoolClient} from "pg";
import {applyToAll, applyPairToAll, diffUpdate} from "../common/diffupdate";
import {KitchenItem} from "../model/internal/kitchenitem";
import {KitchenItemWithTypeName} from "../model/internal/kitchenitemwithtypename";

export class ShoppingListService {

    async items(filter: ShoppingListFilter): Promise<ShoppingItem[]> {
        const states = new Array<string>();

        for (const queryState of filter.itemStates) {
            let stateName: string;
            if (queryState === ItemFulfilmentState.Active) {
                stateName = 'active';
            } else if (queryState === ItemFulfilmentState.Processing) {
                stateName = 'processing';
            } else if (queryState === ItemFulfilmentState.Processed) {
                stateName = 'processed';
            } else {
                logger.error(`Invalid state ${queryState}`)
                stateName = null;
            }
            if (stateName != null) {
                states.push(stateName);
            }
        }
        const res = await pool.query(`SELECT * FROM shopping_list
                INNER JOIN kitchen_item  ON kitchen_item.id = shopping_list.item_id
                INNER JOIN kitchen_item_types ON kitchen_item.item_type = kitchen_item_types.id
                WHERE state = ANY($1)`, [states]);
        logger.info(`number of items in current list: ${res.rows.length}`);
        const items = new Array<ShoppingItem>();
        for (const row of res.rows) {
            items.push(ShoppingListService.sqlToModel(row));
        }
        return items;
    }

    private async findOrAddItems(client: PoolClient, items: KitchenItemWithTypeName[]) {
        const itemTypeNames = applyToAll(items, (item) => item.itemName);
        const typeToIdMap = new Map<string, number>();

        for (const name of itemTypeNames) {
            typeToIdMap.set(name, null);
        }

        const uniqueTypes = Array.from(typeToIdMap.keys());
        const typeIds = await this.findOrAddItemTypes(client, uniqueTypes);

        for (let i = 0; i < uniqueTypes.length; i++) {
            typeToIdMap.set(uniqueTypes[i], typeIds[i]);
        }

        const kitchenItems =
            applyToAll(items, (i) => new KitchenItem(i.itemName, typeToIdMap.get(i.itemType)));
        return await this.findOrAddItemsWithItemTypeId(client, kitchenItems);
    }

    private async findOrAddItemsWithItemTypeId(client: PoolClient, items: KitchenItem[]) {
        return diffUpdate(items,
            (it) => ShoppingListService.findItems(client, it),
            (it) => ShoppingListService.addItems(client, it))
    }

    private static async findItems(client: PoolClient, items: KitchenItem[]) {
        const names = applyToAll(items, (it) => it.itemName);
        const res = await pool.query(
            `SELECT id, item_name FROM kitchen_item WHERE item_name = ANY($1)`, [names]);
        const typeNameMap = new Map<string, number>();
        for (const row of res.rows) {
            typeNameMap.set(row.item_name, row.id);
        }

        const ids = new Array<number>();

        for (const item of items) {
            ids.push(typeNameMap.get(item.itemName));
        }
        return ids;
    }

    private static async addItems(client: PoolClient, items: KitchenItem[]): Promise<number[]> {
        let fmt = "";
        const params = [];
        let index = 1;

        for (const item of items) {
            if (fmt.length !== 0) {
                fmt += ",";
            }
            fmt += `(\$${index},\$${index+1})`;
            params.push(item.itemName, item.itemTypeId);
            index += 2;
        }

        const res = await client.query(`INSERT INTO kitchen_item(item_name, item_type)
                        VALUES ${fmt} RETURNING id`, params);
        return applyToAll(res.rows, (row) => row.id);
    }

    private async findOrAddItemTypes(client: PoolClient, typeNames: string[]): Promise<number[]> {
        return await diffUpdate(typeNames,
            (items) => ShoppingListService.findItemTypes(client, items),
            (items) => ShoppingListService.addItemTypes(client, items));
    }

    private static async findItemTypes(client: PoolClient, typeNames: string[]): Promise<number[]> {
        const res = await client.query(
            `SELECT id, type_name FROM kitchen_item_types WHERE type_name = ANY($1)`,
            [typeNames]);

        const typeNameMap = new Map();

        for (const row of res.rows) {
            typeNameMap.set(row.type_name, row.id);
        }
        const ids = new Array<number>();

        for (const name in typeNames) {
            if (typeNameMap.has(name)) {
                ids.push(typeNameMap.get(name));
            } else {
                ids.push(null);
            }
        }
        return ids;
    }

    private static async addItemTypes(client: PoolClient, typeNames: string[]): Promise<number[]> {
        let valueFormat = "";
        let index = 1;
        for (const name of typeNames) {
            if (valueFormat.length !== 0) {
                valueFormat += ", ";
            }
            valueFormat += `(\$${index++})`;
        }
        const res = await client.query(`INSERT INTO kitchen_item_types(type_name) VALUE
                        ${valueFormat} RETURNING id`, typeNames);
        return applyToAll(res.rows, (row: any) => row.id);
    }

    private static sqlToModel(row: any): ShoppingItem {
        return new ShoppingItem(
            row.id,
            row.item_name,
            row.item_type,
            row.unit_value,
            this.sqlToFulfilmentState(row.state));
    }

    private static sqlToFulfilmentState(state: any): ItemFulfilmentState {
        if (state === 'active') {
            return ItemFulfilmentState.Active;
        } else if (state === 'processing') {
            return ItemFulfilmentState.Processing;
        } else if (state === 'processed') {
            return ItemFulfilmentState.Processed;
        } else {
            logger.error(`Unknown fulfilment type ${state}`)
            return null;
        }
    }
}