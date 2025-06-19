import { Product } from "./product";

export class panierItem {
    private _product: Product;
    public get product(): Product {
        return this._product;
    }
    public set product(value: Product) {
        this._product = value;
    }

    private _quantity: number;
    public get quantity(): number {
        return this._quantity;
    }
    public set quantity(value: number) {
        this._quantity = value;
    }

    private _userId!: number;
    public get userId(): number {
        return this._userId;
    }
    public set userId(value: number) {
        this._userId = value;
    }

    constructor(product : Product , Quantity : number = 1){
        this._product = product;
        this._quantity = Quantity;
    }

}