export class KitchenItemType {
    readonly id: number;
    readonly typeName: string;

    constructor(id: number, typeName: string) {
        this.id = id;
        this.typeName = typeName;
    }
}