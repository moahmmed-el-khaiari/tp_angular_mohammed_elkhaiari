
import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges, Input, AfterViewInit } from '@angular/core';   
import { Product } from '../models/product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink,Router, RouterOutlet,RouterLinkActive, ActivatedRoute } from '@angular/router';
import { ProductDetailsComponent} from '../product-details-component/product-details-component.component';
import { ProductService } from '../product.service';
import { CartComponent } from '../cart/cart.component';
import { HeaderComponent } from '../header/header.component';
import { CartService } from '../cart.service';
import { subscribe } from 'diagnostics_channel';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import{OfferComponent} from '../offer/offer.component';
import Swiper from 'swiper';
import { Subscription } from 'rxjs';

declare var tns: any;
@Component({
  selector: 'app-catalog-component',      
  templateUrl: './catalog-component.component.html',     
  styleUrls: ['./catalog-component.component.css'],
  standalone:true,
  imports:[HeaderComponent,RouterOutlet, CommonModule, FormsModule,ProductDetailsComponent,CartComponent,HttpClientModule,RouterLink,RouterLinkActive,OfferComponent],
})
export class CatalogComponentComponent implements OnInit,AfterViewInit{
  
  user: any;
  @Input()
  myValue : string = "";
  filter: string = ""
  searchTerm: string = '';
  filteredProducts: Product[] = [];
  productSubscription!: Subscription;
  cartItemCount: number = 0;
  cartItemCountSubscription!: Subscription;


    getProductList():Observable<Product[]>{
  return this.http.get<Product[]>('/products');
}
  showCategories: boolean = false;
 toggleCategoriesVisibility(): void {
  this.showCategories = !this.showCategories;
  
}

    constructor(private router: Router,private productService : ProductService,private cartService: CartService,private http: HttpClient,private route: ActivatedRoute){}
    isLowStock(quantity: number): boolean {
      return this.productService.isLowStock(quantity);
    }


    selectedProduct: Product = new Product(0, '',0, 0, '', '', '');
    showProductDetails(product: Product): void {
      this.selectedProduct = product;
    }


   
   
    products: Product[] = [];
    ngOnInit(): void {
        this.cartService.getProductList().subscribe(products =>{
         this.products=products
              })
          console.log('child onit called')


        this.route.queryParams.subscribe((params)=>{
         this.filter = params['filter'] ?? '';
          })

        console.log("child OnInit is called ")

          this.route.queryParams.subscribe(params => {
            this.searchCategory = params['filter'] || ''; // Catégorie de recherche
            this.searchDetails = params['details'] || ''; // Détails de recherche
            this.getFilteredProductsss();
          });

          this.cartItemCountSubscription = this.cartService.cartItemCount$.subscribe(count => {
            this.cartItemCount = count;
          });
//important pour n'a pas afficher l'espace de les produits qui ont null -------------
          this.productService.getProducts().subscribe((data: any[]) => {
            // Filtrer la liste de produits pour exclure ceux avec une quantité nulle
            this.products = data.filter(product => product.quantity > 0);
          });
}

ngAfterViewInit(){
}
  

searchCategory: string = ''; // Catégorie de recherche
  searchDetails: string = '';
getFilteredProductsss(): void {
  this.cartService.getProductList().subscribe(products => {
    if (!this.searchCategory && !this.searchDetails) {
      this.products = products; // Si aucun filtre n'est spécifié, obtenir tous les produits
    } else {
      this.products = products.filter(product =>
        (!this.searchCategory || product.category === this.searchCategory) && // Filtrer par catégorie si spécifiée
        (!this.searchDetails || this.searchDetailsMatches(product.details, this.searchDetails)) // Filtrer par détails du produit si spécifiés
      );
    }
    this.products = this.products.filter(product => product.quantity > 0);

  });

}

searchDetailsMatches(details: string, searchTerm: string): boolean {
  details = details.toLowerCase();
  searchTerm = searchTerm.toLowerCase();
  return details.includes(searchTerm);
}

// Appliquer le filtre lorsque le bouton de recherche est cliqué
applyFilter(): void {
  this.router.navigate(['/catalog'], { queryParams: { filter: this.searchCategory, details: this.searchDetails } });
}

// Appliquer le filtre par catégorie lorsqu'un bouton est cliqué
applyCategoryFilter(category: string): void {
  this.searchCategory = category;
  this.applyFilter(); // Appliquer le filtre avec la nouvelle catégorie sélectionnée
}





}
