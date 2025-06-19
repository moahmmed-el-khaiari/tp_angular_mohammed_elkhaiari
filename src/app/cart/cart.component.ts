import { Component ,Input, OnDestroy, OnInit} from '@angular/core';
import { CartService } from '../cart.service';
import { Observable, Subscription } from 'rxjs';
import { Product } from '../models/product';
import { CommonModule } from '@angular/common';
import { panier } from '../models/panier';
import { panierItem } from '../models/panierItem';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,RouterOutlet,FormsModule,CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{


  cartSubscription: Subscription | undefined;
  cart : panier = new panier();;
  products! : Array<Product>;
  user :  any;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    
    //this.cart = this.cartService.getCartByUser(6);
    const currentUser = localStorage.getItem('User');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }

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

  get cartItems() {
    return this.cart;
  }

  getImageUrl(product: Product){
    return product.product_image
  }

  totalAmount: number = 0;
  calculateTotalAmount(): void {
    // Réinitialiser le montant total
    this.totalAmount = 0;
    // Pour chaque produit du panier, calculer le montant total
    this.cart.Products.forEach((item: panierItem) => {
      this.totalAmount += item.quantity * item.product.product_price;
    });
  }



  loadCart() {
    this.cartService.getCartByUser(this.user.id);
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
  



  ngOnDestroy() {
    // Assurez-vous de désabonner pour éviter les fuites de mémoire
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }









  
}