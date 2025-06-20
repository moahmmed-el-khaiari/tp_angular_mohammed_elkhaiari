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
  product: Product | undefined;
  private apiUrl = 'http://localhost:8081/products';
  relatedProducts: Product[] = []; 
  category!: string;
  user: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private http: HttpClient,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Récupérer l'utilisateur depuis le localStorage
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      this.user = JSON.parse(userFromStorage);
    }

    // Charger le produit à partir de l'URL
    this.route.params.pipe(
      switchMap(params => {
        this.productId = +params['id'];
        return this.getProductDetails(this.productId);
      })
    ).subscribe({
      next: (product: Product) => {
        this.product = product;
        this.loadRelatedProducts();
      },
      error: (err) => {
        console.error('Erreur lors du chargement du produit:', err);
      }
    });
  }

  getProductDetails(productId: number): Observable<Product> {
    const url = `${this.apiUrl}/${productId}`;
    return this.http.get<Product>(url);
  }

  loadRelatedProducts(): void {
    if (this.product?.category) {
      const currentCategory = this.product.category;
      this.productService.getProductsByCatalog(currentCategory).subscribe({
        next: (products: Product[]) => {
          this.relatedProducts = products
            .filter(p => p.productID !== this.productId && p.quantity > 0);
        },
        error: (err) => {
          console.error('Erreur lors du chargement des produits liés:', err);
        }
      });
    }
  }

  isLowStock(quantity: number): boolean {
    return this.productService.isLowStock(quantity);
  }

  addToCart(product: Product) {
    if (!this.user || !this.user.id) {
      alert("Veuillez vous connecter pour ajouter au panier.");
      return;
    }

    this.cartService.addToCart(product, this.user.id).subscribe({
      next: (response) => {
        console.log('Produit ajouté au panier avec succès:', response);
        this.cartService.cartSubject.next(response.updatedCart);
      },
      error: (e) => console.error('Erreur lors de l’ajout au panier :', e)
    });
  }

}
