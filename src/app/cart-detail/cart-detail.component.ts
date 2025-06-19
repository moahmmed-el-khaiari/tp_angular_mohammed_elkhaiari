import { Component } from '@angular/core';
import { RouterLink,Router, RouterOutlet,RouterLinkActive, ActivatedRoute } from '@angular/router';
import { Product } from '../models/product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CartService } from '../cart.service';
import { panier } from '../models/panier';
import { panierItem } from '../models/panierItem';
@Component({
  selector: 'app-cart-detail',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,RouterOutlet,FormsModule,CommonModule],
  templateUrl: './cart-detail.component.html',
  styleUrl: './cart-detail.component.css'
})
export class CartDetailComponent {

  cart : panier = new panier();
  quantity: any;
  products! : Array<Product>;
  user :  any;
  totalAmount: number = 0;
  cartt: panierItem[] = [];
  cartSubscription: Subscription | undefined;
  constructor(private cartService: CartService) { this.cart.Products = [];}

  ngOnInit() {
    const currentUser = localStorage.getItem('User');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
    console.log("user dans cart detail ",this.user.id)
    //this.cart = this.cartService.getCartByUser(6);
    //console.log(this.cart.Products);
    this.cartService.getAllCarts().subscribe({
      next : (data) => {
         let filteredItems : panierItem[] = data.filter(item => {
            return item.userId == this.user.id;
        });
       
         if(filteredItems != undefined){
            this.cart.Products  = filteredItems;
            this.calculateTotalAmount();
         }
         console.log(filteredItems);
      },
      error : (error) => {
         console.log(error);
         return error;
      }
   });


          // Abonnement au BehaviorSubject pour écouter les mises à jour du panier
         this.cartSubscription = this.cartService.cartSubject.subscribe(cart => {
            this.cart = cart;
          });
    this.loadCart();
       
  }


  total: number = 0;
  calculateTotal(): void {
    this.total = 0;
    for (let product of this.cart.Products) {
      this.total += product.quantity * product.product.product_price;
    }

  }

  calculateTotalAmount(): void {
    // Réinitialiser le montant total
    this.totalAmount = 0;
    // Pour chaque produit du panier, calculer le montant total
    this.cart.Products.forEach((item: panierItem) => {
      this.totalAmount += item.quantity * item.product.product_price;
    });
  }

  chosenQuantity: number = 1;


  calculateTotalPrice(product: any): number {
    // Calculer le prix total du produit en multipliant le prix par la quantité choisie par l'utilisateur
    return product.productPrice * this.chosenQuantity;
  }

  increment(currentSCI : panierItem) {
    let item = this.cart.Products.find(x=>x.product.productID == currentSCI.product.productID);
    console.log("currentSCI",currentSCI.product.productID)
    if(item != undefined){
      if (item.quantity < item.product.quantity) {
        this.chosenQuantity++;
        item.quantity++;
        this.chosenQuantity = item.quantity
        this.calculateTotalAmount();
      }
      this.cartService.updateItem(item.product,item.quantity).subscribe({
        next : ()=>{
          console.log(item?.quantity);
          return true;
        },
        
        error: ()=>{
          // this.showNotification('An error occurred. Please try again');
        }
      });
    }
  }

  decrement(currentSCI : panierItem) {
    let item = this.cart.Products.find(x=>x.product.productID == currentSCI.product.productID);
    if(item != undefined){
      if (item.quantity > 1) {
        item.quantity--;
        this.chosenQuantity--;
        this.calculateTotalAmount();
      }
     
          this.cartService.updateItem(item.product,item.quantity).subscribe({
          next : ()=>{
            return true;
          },
          error: ()=>{
           /// this.showNotification('An error occurred. Please try again');
          }
        });
      
    }
  }



  get cartItems() {
    return this.cart;
  }

  removeFromPanier(productId: number) {
    // Supprimer le produit du panier en utilisant le service
    this.cartService.deleteProductFromPanier(productId).subscribe({
      next: (response) => {
        console.log('Produit supprimé du panier avec succès:', response);
        // Rechargez les éléments du panier après la suppression
        this.loadCart();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression du produit du panier:', error);
      }
    });
  }

  loadCart() {
    this.cartService.getCartByUser(this.user.id);
  }
  getImageUrl(product: Product){
    return product.product_image
  }

  
}
