import { Injectable } from '@angular/core';
import { Product } from './models/product';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductService  {

  constructor(private http: HttpClient) { }

   private products :Product[]=[];

   /*getProduct(): Product[] {
    return this.products;
   }*/
   toggleDescription(product : Product): void {
    product.showDescription = !product.showDescription;

   }
   getAvailableProducts(): Product[] {
    return this.products.filter(product => product.quantity > 0);
  }

  isLowStock(quantity: number): boolean {
    return quantity > 0 && quantity < 5;
  }
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:8081/products');
  }


  getProductsByCatalog(catalog: string): Observable<Product[]> {
    return this.http.get<Product[]>(`http://localhost:8081/products?category=${catalog}`);
  }

  private apiUrl = 'http://localhost:8081/products';

  addProduct(product: Product): Observable<any> {
    const mappedProduct = {
      productID: product.productID,
      product_title: product.product_title,  // Nom de colonne spécifique pour le titre du produit
      product_price: product.product_price,  // Nom de colonne spécifique pour le prix du produit
      quantity: product.quantity,
      product_image: product.product_image,
      category: product.category,
      details: product.details,
      isLowStock: product.isLowStock,
      showDescription: product.showDescription
    };

    return this.http.post<any>(this.apiUrl, mappedProduct);
  }












  //modification de produit

  updateProduct(product: Product): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${product.productID}`, product);
  }

  getProductById(productId: number): Observable<Product> {
    //return this.http.get<Product>(`${this.apiUrl}/${productId}`);
    const url = `http://localhost:8081/products/${productId}`;
    return this.http.get<any>(url); // Utiliser HttpClient pour faire la requête HTTP
  }

//supprission
deleteProduct(productId: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/delete/${productId}`);
}


setPromotion(percentage: number, duration: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/promotions?percentage=${percentage}&duration=${duration}`, {});
}
private discountPercentageSubject = new BehaviorSubject<number>(0);
discountPercentage$ = this.discountPercentageSubject.asObservable();

setDiscountPercentage(percentage: number): void {
 
  this.discountPercentageSubject.next(percentage);
  console.log('Percentage updated:', percentage);
}

getDiscountPercentage(): Observable<number> {
  return this.discountPercentage$;
}
  


}
