export class KitchenItem {
    readonly itemName: string;
    readonly itemTypeId: number;

    constructor(itemName: string, itemTypeId: number) {
        this.itemName = itemName;
        this.itemTypeId = itemTypeId;
    }
}