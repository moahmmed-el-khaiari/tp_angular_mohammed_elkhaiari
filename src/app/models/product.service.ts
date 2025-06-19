// src/app/product.service.ts
import { Injectable } from '@angular/core';
//import { Product } from './models/product';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    //{ id: 1, name: 'Product 1', quantity: 10 },
    //{ id: 2, name: 'Product 2', quantity: 3 },
    // Ajoutez d'autres produits
  ];

  getProducts(): Product[] {
    return this.products;
  }

}
