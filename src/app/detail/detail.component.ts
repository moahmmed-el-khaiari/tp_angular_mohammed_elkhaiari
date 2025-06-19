import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product';
import { ProductDetailsComponent } from "../product-details-component/product-details-component.component";
import { CartService } from '../cart.service';
@Component({
    selector: 'app-detail',
    standalone: true,
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.css',
    imports: [FormsModule, CommonModule, ProductDetailsComponent]
})
export class DetailComponent implements OnInit {

  productId!: number;
  product: any;
  private apiUrl = 'http://localhost:8081/products';
  relatedProducts: Product[] = []; 
  category!: string;

  constructor(private route: ActivatedRoute,
    private productService: ProductService,
    private http: HttpClient, private cartService: CartService) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        this.productId = params['id']; // Récupérer l'ID du produit depuis les paramètres de l'URL
        return this.getProductDetails(this.productId);
      })
    ).subscribe(
      (product: any) => {
        this.product = product; // Affecter le produit récupéré
        this.loadRelatedProducts(); // Charger les produits liés
      },
      (error) => {
        console.error('Error loading product details:', error);
      }
    );

  }

  loadProductDetails(productId: number): void {
    this.getProductDetails(productId).subscribe(
      (product: any) => {
        this.product = product; // Affecter le produit récupéré
      },
      (error) => {
        console.error('Error loading product details:', error);
      }
    );
  
  }

  
  getProductDetails(productId: number): Observable<any> {
    const url = `http://localhost:8081/products/${productId}`;
    return this.http.get<any>(url); // Utiliser HttpClient pour faire la requête HTTP
  }

  loadRelatedProducts(): void {
    if (this.product && this.product.category) {
      console.log(this.product.category)
      // Récupérer le category du produit actuel
      const currentCategory = this.product.category;
      // Charger les produits liés ayant le même category
      this.productService.getProductsByCatalog(currentCategory).subscribe(
        (products: Product[]) => {
          // Exclure le produit actuel de la liste des produits liés
          this.relatedProducts = products.filter(product => product.productID !== this.productId);
          
          this.relatedProducts = this.relatedProducts.filter(product => product.quantity > 0);
        },
        (error) => {
          console.error('Error loading related products:', error);
        }
      );
    }
  }
  isLowStock(quantity: number): boolean {
    return this.productService.isLowStock(quantity);
  }


  user :  any;
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

}
