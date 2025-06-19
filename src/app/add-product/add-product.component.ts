import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink,Router, RouterOutlet,RouterLinkActive, ActivatedRoute } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../models/product';
@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterLink,RouterOutlet,RouterLinkActive],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  @ViewChild('productForm') productForm!: NgForm;
  product: Product = new Product(0, '', 0, 0, '', '', ''); 


  
  constructor(private router: Router,private productService: ProductService,private route: ActivatedRoute) { }

  
  isEditMode: boolean = false; 
  ngOnInit(): void {
    const productId = parseInt(this.route.snapshot.paramMap.get('productID') || '0', 10);

    if (productId !== 0) {
      // Mode de modification
      this.isEditMode = true;
      this.loadProductDetails(productId);
    } else {
      // Mode d'ajout
      this.isEditMode = false;
      this.product = new Product(0, '', 0, 0, '', '', '');
    }
  }
  
  loadProductDetails(productId: number): void {
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
      },
      error: (error) => {
        console.error('Une erreur est survenue lors de la récupération des détails du produit :', error);
      }
    });
  }
  
  submitForm(): void {
    console.log('Valeur du prix avant la soumission du formulaire :', this.product.product_price);
    if (this.productForm.valid) {
      if (this.isEditMode) {
        // Logique de modification
        this.productService.updateProduct(this.product).subscribe({
          next: (res) => {
            console.log('Produit modifié avec succès :', res);
            this.router.navigate(['/catalog']);
          },
          error: (error) => {
            console.error('Une erreur est survenue lors de la modification du produit :', error);
          }
        });
      } else {
        // Logique d'ajout
        this.productService.addProduct(this.product).subscribe({
          next: (res) => {
            console.log('Produit ajouté avec succès :', res);
            this.router.navigate(['/catalog']);
          },
          error: (error) => {
            console.error('Une erreur est survenue lors de l\'ajout du produit :', error);
          }
        });
      }
    }
  }
  

}
