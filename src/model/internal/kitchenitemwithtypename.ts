export class KitchenItemWithTypeName {
    readonly itemName: string;
    readonly itemType: string;

    constructor(itemName: string, itemType: string) {
        this.itemName = itemName;
        this.itemType = itemType;
    }
}