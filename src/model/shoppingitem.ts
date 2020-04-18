import {ItemFulfilmentState} from "./fulfilmentstate";

export class ShoppingItem {
    readonly id: number;
    readonly itemName: string;
    readonly itemType: string;
    readonly requiredUnit: number;
    readonly fulfilmentState: ItemFulfilmentState;

    constructor(id: number,
                itemName: string,
                itemType: string,
                requiredUnit: number,
                fulfilmentState: ItemFulfilmentState) {
        this.id = id;
        this.itemName = itemName;
        this.itemType = itemType;
        this.requiredUnit = requiredUnit;
        this.fulfilmentState = fulfilmentState;
    }
}