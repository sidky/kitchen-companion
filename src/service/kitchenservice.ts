import {pool} from "../storage/postgres";
import {KitchenItemType} from "../model/kitchenitemtype";
import {applyToAll} from "../common/diffupdate";
import {KitchenItem} from "../model/kitchenitem";
import {QueryResult} from "pg";
import {ExactStringMatchFilter, PrefixStringMatchFilter} from "../common/filters";
import {KitchenItemFilter} from "../model/filter/kitchenitem";

export class KitchenService {

    async items(filter: KitchenItemFilter): Promise<KitchenItem[]> {
        let res: QueryResult<any>;
        if (filter.itemType == null && filter.typeNameFilter) {
            res = await pool.query(`SELECT id, item_name, item_type FROM kitchen_item`);
        } else {
            let query = "SELECT id, item_name, item_type FROM kitchen_item";
            let whereClause = "";
            const params = new Array<any>();
            let index = 1;

            if (filter.typeNameFilter != null) {
                if ((filter.typeNameFilter as ExactStringMatchFilter).str) {
                    whereClause += `item_name = \$${index++}`;
                    params.push((filter.typeNameFilter as ExactStringMatchFilter).str);
                } else if ((filter.typeNameFilter as PrefixStringMatchFilter).prefix) {
                    whereClause += `item_name LIKE \$${index++}'`;
                    params.push((filter.typeNameFilter as PrefixStringMatchFilter).prefix + "%");
                }
            }

            if (filter.itemType != null) {
                if (whereClause.length > 0) {
                    whereClause += " AND ";
                }

                whereClause += `item_type IN ANY(\$${index++})`;
                params.push(filter.itemType.itemTypeId);
            }

            query += whereClause;

            res = await pool.query(query, params);
        }

        return applyToAll(res.rows, KitchenService.rowToKitchenItem);
    }

    async addItems(items: KitchenItem[]): Promise<KitchenItem[]> {
        let fmt = "";
        let index = 1;
        const params = [];

        for (const item of items) {
            if (fmt.length !== 0) {
                fmt += ", ";
            }
            fmt += `(\$${index}, \$${index+1})`;
            index += 2;
            params.push(item.itemName, item.itemTypeId);
        }

        const res = await pool.query(
            `INSERT INTO kitchen_item(item_name, item_type) VALUES ${fmt}
                RETURNING id, item_name, item_type`,
            params);

        return applyToAll(res.rows, KitchenService.rowToKitchenItem);
    }

    async itemTypes(): Promise<KitchenItemType[]> {
        const res = await pool.query(`SELECT id, type_name FROM kitchen_item_types`);
        return applyToAll(res.rows, KitchenService.rowToKitchenItemType);
    }

    async addItemTypes(types: KitchenItemType[]): Promise<KitchenItemType[]> {
        let fmt = "";
        let index = 1;
        const params = [];

        for (const type of types) {
            if (fmt.length > 0) {
                fmt += ", ";
            }
            fmt += `(\$${index++})`;
            params.push(type.typeName);
        }
        const res = await pool.query(`INSERT INTO kitchen_item_types(type_name)
                        VALUES ${fmt}
                        RETURNING id, type_name`,
            params)
        return applyToAll(res.rows, KitchenService.rowToKitchenItemType)
    }

    private static rowToKitchenItem(row: any) {
        return new KitchenItem(row.id, row.item_name, row.item_type);
    }

    private static rowToKitchenItemType(row: any) {
        return new KitchenItemType(row.id, row.type_name);
    }
}