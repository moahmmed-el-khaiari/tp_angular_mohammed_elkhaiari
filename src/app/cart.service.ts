import { Injectable } from '@angular/core';
import { of, Observable, BehaviorSubject, map, tap, throwError } from 'rxjs';
import { Product } from './models/product';
import { HttpClient } from '@angular/common/http';
import { panier } from './models/panier';
import { panierItem } from './models/panierItem';

@Injectable({
  providedIn: 'root'
})
export class CartService {
private baseUrl = 'http://localhost:8081';

panier : panier = new panier();
panierItem! : panierItem;
public cartSubject: BehaviorSubject<panier> = new BehaviorSubject<panier>(new panier());

//variable dajout la valeur de count
private cartItemCountSubject: BehaviorSubject<number>;
  cartItemCount$: Observable<number>; 

constructor(private http: HttpClient) {
  this.cartItemCountSubject = new BehaviorSubject<number>(0); // Initialisez le BehaviorSubject
  this.cartItemCount$ = this.cartItemCountSubject.asObservable();
  
  const storedCartItemCount = localStorage.getItem('cartItemCount');
  if (storedCartItemCount) {
    this.cartItemCountSubject.next(parseInt(storedCartItemCount, 10)); // Mettre à jour le sujet avec la valeur stockée
  }
}
//recupere tous les produit
getProductList():Observable<Product[]>{
    return this.http.get<Product[]>('http://localhost:8081/products');
  }
//recuperer tous les paniers
getAllCarts() : Observable<panierItem[]> {
    return this.http.get<panierItem[]>('http://localhost:8081/panier');
  }
//recuperer les paniers de user  connecté
getCartByUser(userId : number) : panier{
    this.getAllCarts().subscribe({
       next : (data) => {
          let filteredItems : panierItem[] = data.filter(item => {
             return item.userId === userId;
         });
          if(filteredItems != undefined){
             this.panier.Products  = filteredItems;
          }
       },
       error : (error) => {
          console.log(error);
          return error;
       }
    });
    return this.panier;
 }

 public addItem(product : Product , id : number) : Observable<any>{
  const data = {
     userId : id,
     product : product,
     quantity : 1
 };
  return this.http.post(`http://localhost:8081/panier/post`,data);
}

public removeItem(product : Product) : Observable<any>{
  //return this.http.delete(`http://localhost:8080/panier/delete/${product.productID}`);

  return this.http.delete(`http://localhost:8081/panier/delete/${product.productID}`);
}

public updateItem(product : Product , quantity : number) : Observable<any>{
  const data = {
    product : product,
    quantity : quantity
 };
  return this.http.put(`http://localhost:8081/panier/put/${product.productID}`,data);
}

public addToCart(product: Product, userId: number): Observable<any> {
   
  let p = this.getCartByUser(userId).Products.find(value => value.product.productID === product.productID);
  console.log('Product:',product);
   if (p === undefined) {
     
       //this.showNotification('Item added to Cart');
       console.log('Item added to Cart');
       return this.addItem(product,userId);
    
    }
    else {
      console.log('This item is already in your Cart!');
       //this.showNotification("This item is already in your Cart!");
       return of({});
    }



      /* Vérifier si le produit est déjà dans le panier de l'utilisateur
  const cart = this.getCartByUser(userId);
  const existingProduct = cart.Products.find(item => item.product.productID === product.productID);

  if (!existingProduct) {
    // Si le produit n'existe pas dans le panier, l'ajouter avec une quantité initiale de 1
    return this.addItem(product, userId);
  } else {
    // Si le produit existe déjà dans le panier, mettre à jour la quantité
    const newQuantity = existingProduct.quantity + 1;
    return this.updateItem(product, newQuantity);
  }*/
 }






   //supprition  d'un produit de panier
   deleteProductFromPanier(productId: number): Observable<any> {
      const url = `http://localhost:8081/panier/delete/${productId}`;
      return this.http.delete(url).pipe(
        tap(() => {
          const updatedCart = this.cartSubject.getValue();
          updatedCart.Products = updatedCart.Products.filter(item => item.product.productID !== productId);
          this.updateCart(updatedCart);
          if (this.cartItemCountSubject.value > 0) {
            this.updateCartItemCount(this.cartItemCountSubject.value - 1); 
          }
        })
      );

    }
      // Mettre à jour le panier
  updateCart(cart: panier) {
    this.cartSubject.next(cart);
  }

//methode pour mise a jour le coubt dans panier 
  private updateCartItemCount(count: number): void {
    this.cartItemCountSubject.next(count); // Mettre à jour le BehaviorSubject avec le nouveau nombre d'articles
    localStorage.setItem('cartItemCount', count.toString()); // Enregistrer le nouveau nombre d'articles dans le stockage local
  }







  updateQuantity(productId: number, quantity: number): Observable<any> {
    const url = `${this.baseUrl}/panier/update-quantity/${productId}`;
    // Envoyer une requête PUT avec l'ID du produit et la nouvelle quantité
    return this.http.put(url, quantity);
  }
}


  


