export class KitchenItemTypesFilter {
    readonly itemTypeId: number[];

    constructor(itemTypeId: number[]) {
        this.itemTypeId = itemTypeId;
    }
}