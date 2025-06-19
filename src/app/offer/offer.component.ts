import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import { CartService } from '../cart.service';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
declare var tns: any;
@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [CommonModule,RouterModule,],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.css'
})
export class OfferComponent implements OnInit,AfterViewInit{
  
  @Input() product!: Product;
  currentIndex: number = 0;
  intervalId: any;
  products: Product[] = [];

  constructor(private productService: ProductService, private cartService: CartService) {}

  prevSlide() {
    this.currentIndex = (this.currentIndex === 0) ? this.products.length - 1 : this.currentIndex - 1;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex === this.products.length - 1) ? 0 : this.currentIndex + 1;
  }

  ngOnInit(): void {
    this.loadProducts();
    this.startAutoScroll();
   //this.startAutoScroll();
    
  }
  startAutoScroll() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000); // Change d'image toutes les 3 secondes
  }

  stopAutoScroll() {
    clearInterval(this.intervalId); // Arrête le défilement automatique
  }
  ngOnDestroy() {
    this.stopAutoScroll(); // Arrête le défilement automatique lors de la destruction du composant
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
      
    });
  }
  getFilteredProducts() {
    return this.products.filter(product => product.quantity < 5);
  }


  ngAfterViewInit(): void {
    if (this.products.length > 0) {
      this.startAutoScroll();
    }

  }
  

  showFullDetails: boolean = false;
  previewLength: number = 100;
  toggleFullDetails() {
    this.showFullDetails = !this.showFullDetails;
  }
}
