import {ExactStringMatchFilter, PrefixStringMatchFilter} from "../../common/filters";
import {KitchenItemTypesFilter} from "./kitchenitemtype";

export class KitchenItemFilter {
    readonly typeNameFilter: (ExactStringMatchFilter | PrefixStringMatchFilter);
    readonly itemType: KitchenItemTypesFilter;

    constructor(typeNameFilter: (ExactStringMatchFilter | PrefixStringMatchFilter),
                itemType: KitchenItemTypesFilter) {
        this.typeNameFilter = typeNameFilter;
        this.itemType = itemType;
    }
}