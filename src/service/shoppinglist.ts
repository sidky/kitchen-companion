// import logger from "../common/logger";

import {pool} from "../storage/postgres"
import {logger} from "../common/logger";
import {ShoppingListFilter} from "./shoppinglist/filter";
import {ShoppingItem} from "../model/shoppingitem";
import {ItemFulfilmentState} from "../model/fulfilmentstate";

export class ShoppingListService {

    async items(filter: ShoppingListFilter) {
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