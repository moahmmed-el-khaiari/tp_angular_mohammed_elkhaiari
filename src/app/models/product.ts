  // src/app/models/product.model.ts
  export class Product {
                                      //Déclaration de la classe Product
    constructor(                      //Constructeur de la classe Product:
      private _productID: number,     //Un identifiant du produit (en lecture seule, c'est-à-dire qu'il ne peut pas être modifié après l'initialisation).
      private _product_title: string,
      private _product_price: number,
      public quantity: number,
      public product_image: string,   
      public category: string,
      public details: string,
      public isLowStock: boolean = false,
      public showDescription: boolean = false,
      private _originalPrice?: number

    ) {}

    public get productID(): number {
      return this._productID;
    }
    public set productID(value: number) {
      this._productID = value;
    }         

    public get product_title(): string {
      return this._product_title;
    }

    public set product_title(value: string) {
      this._product_title = value;
    }

    public get product_price(): number {
      return this._product_price;
    }

    public set product_price(value: number) {
      this._product_price = value;
    }

    public printProduct(): string {
      return (
        'productID:' +
        this.productID +
        ', productTitle: ' +
        this.product_title +
        ', productPrice: ' +
        this.product_price +
        ', quantity: ' +
        this.quantity
      );
    }

    public calculateDiscountedPrice(percentage: number): number {
      const discountAmount = this.product_price * (percentage / 100);
      return this.product_price - discountAmount;
    }
    public get originalPrice(): number {
      return this._originalPrice ?? this._product_price;
    }
  
    public set originalPrice(value: number) {
      this._originalPrice = value;
    }
  }
