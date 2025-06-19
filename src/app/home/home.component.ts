import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { RouterLink,Router, RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterOutlet,FormsModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  products: Product[] = [];
  selectedCategory: string = 'all'; // Par défaut, afficher tous les produits

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();


    
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (products: Product[]) => {
        this.products = products;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  filterProductsByCategory(category: string): void {
    if (category === 'all') {
      // Afficher tous les produits
      this.loadProducts();
    } else {
      // Filtrer les produits par catégorie
      this.productService.getProductsByCatalog(category).subscribe(
        (products: Product[]) => {
          this.products = products;
        },
        (error) => {
          console.error('Error fetching products by category:', error);
        }
      );
    }
  }



  
}
