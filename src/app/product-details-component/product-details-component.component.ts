import { Component, Input, OnInit , OnChanges, OnDestroy, SimpleChanges,Output,EventEmitter } from '@angular/core';
import { Product } from '../models/product';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import { CartService } from '../cart.service';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { panier } from '../models/panier';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  imports: [CommonModule,RouterModule],
  standalone: true,
  selector: 'app-product-details-component',
  templateUrl: './product-details-component.component.html',
  styleUrls: ['./product-details-component.component.css'],
})

export class ProductDetailsComponent implements OnInit,OnChanges, OnDestroy{

  @Input() product!: Product;
 
  @Output() toggleDetails: EventEmitter<void> = new EventEmitter<void>();
  @Output() addToCartClicked: EventEmitter<Product> = new EventEmitter<Product>();


  user :  any;
  cartSubscription: Subscription | undefined;
  cart : panier = new panier();;
  discountPercentage: number = 0;
  originalPrice!: number;
  //constructor() { }

  products: Product[] = [];

  constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute,private router: Router,) {
    //this.user = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
   // this.products = this.productService.getProduct();
    // Safe to use localStorage
    // Your code that interacts with localStorage here

    const currentUser = localStorage.getItem('User');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
    //modification 


    this.productService.getDiscountPercentage().subscribe(percentage => {
      this.discountPercentage = percentage;
      // Mettez à jour le prix original chaque fois que le pourcentage de réduction change
      this.updateOriginalPrice();
    });
    // Subscribe to promotion end event



  this.cartSubscription = this.cartService.cartSubject.subscribe(cart => {
    this.cart = cart;
  });

this.loadCart();
  }

  isPromotionApplied: boolean = false;
  updateOriginalPrice(): void {
    
   //this.originalPrice = this.product.product_price / (1 - this.discountPercentage / 100);
   if (this.discountPercentage > 0 && this.discountPercentage < 100) {
    this.originalPrice = this.product.product_price / (1 - this.discountPercentage / 100);
    this.isPromotionApplied = true;
  } else {
    this.originalPrice = this.product.product_price;
    this.isPromotionApplied = false;
  }
  }
  isNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value);
  }
  
  

  editProduct() {
    if (this.product && this.product.productID) {
      // Rediriger vers le composant AddProductComponent en mode d'édition avec l'ID du produit
      this.router.navigate(['/add-product', { productID: this.product.productID }]);
    } else {
      console.error("Impossible de récupérer l'ID du produit.");
    }
}
  
/*deleteProduct() {
  this.productService.deleteProduct(this.product.productID).subscribe(
    () => {
      // Suppression réussie, vous pouvez effectuer d'autres actions si nécessaire
      console.log("Produit supprimé avec succès !");
    },
    (error) => {
      // Gestion des erreurs
      console.error("Erreur lors de la suppression du produit :", error);
    }
  );
}*/

/*deleteProduct() {
  // Afficher la boîte de dialogue de confirmation
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this product!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      // Si l'utilisateur confirme la suppression, appeler le service pour supprimer le produit
      this.productService.deleteProduct(this.product.productID).subscribe(
        () => {
          // Suppression réussie, vous pouvez effectuer d'autres actions si nécessaire
          console.log("Product deleted successfully!");
          // Rafraîchir la liste des produits ou effectuer d'autres actions si nécessaire

          this.products = this.products.filter(p => p.productID !== this.product.productID);
        },
        (error) => {
          // Gestion des erreurs
          console.error("Error deleting product:", error);
          // Afficher un message d'erreur à l'utilisateur
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while deleting the product.',
          });
        }
      );
    }
  });
}*/
deleteProduct() {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this product!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.productService.deleteProduct(this.product.productID).subscribe(
        () => {
          console.log("Product deleted successfully!");
          // Supprimez le produit de la liste des produits
          // Par exemple, si vous avez une liste de produits dans le composant, vous pouvez la mettre à jour
          // après la suppression réussie
          this.products = this.products.filter(p => p.productID !== this.product.productID);
          // Affichez un message de confirmation
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Product deleted successfully.',
            
          });
          window.location.reload();
        },
        
        (error) => {
          console.error("Error deleting product:", error);
          // Affichez un message d'erreur
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while deleting the product.',
          });
        }
      );
    }
  });
}



  getAvailableProducts(): Product[] {
    return this.productService.getAvailableProducts();
  }

  isLowStock(quantity: number): boolean {
    return this.productService.isLowStock(quantity);
  }

  toggleDescription(): void {
    this.showDescription = !this.showDescription;
    this.toggleDetails.emit();
  }

  selectedProduct: Product | undefined;
  showDescription: boolean = false

    ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProduct'] && !changes['selectedProduct'].firstChange) {
      this.showDescription = false;
    }
    this.products = this.products.filter(product => product.quantity >= 0);
    this.products.forEach(product => {
      product.isLowStock = this.isLowStock(product.quantity);
    });
  }
  
  showProductDetails(product: Product): void {
   // this.selectedProduct = product;
   this.toggleDetails.emit();
   //console.log('executer');
  }
  ngOnDestroy(): void {
    console.log('product-details a été lancé');
  }

  loadCart() {
    this.cartService.getCartByUser(this.user.id);
  }

  
  addToCart(product : Product) {
    this.cartService.addToCart(product,this.user.id).subscribe({
      next: (response) => {
        console.log('Produit ajouter du panier avec succès:', response);
        // Rechargez les éléments du panier après la suppression
        this.cartService.cartSubject.next(response.updatedCart);
        
        //window.location.reload();
      },
      error:(e)=>console.error(e)
    });
  }


    
  showFullDetails: boolean = false;
  previewLength: number = 100;
  toggleFullDetails() {
    this.showFullDetails = !this.showFullDetails;
  }
}