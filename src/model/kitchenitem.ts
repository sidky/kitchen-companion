export class KitchenItem {
    readonly id: number;
    readonly itemName: string;
    readonly itemTypeId: number;

    constructor(id: number, itemName: string, itemTypeId: number) {
        this.id = id;
        this.itemName = itemName;
        this.itemTypeId = itemTypeId;
    }
}