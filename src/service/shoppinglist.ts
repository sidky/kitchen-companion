// import logger from "../common/logger";

import {pool} from "../storage/postgres"
import {logger} from "../common/logger";
import {ShoppingListFilter} from "./shoppinglist/filter";

export class ShoppingListService {

    items(filter: ShoppingListFilter) {
        return pool.query('SELECT * FROM shopping_list WHERE state=$1', ['active'])
            .then(res => {
                logger.log("info", `rows: ${res.rows[0].item_id}`);
            })
    }


}