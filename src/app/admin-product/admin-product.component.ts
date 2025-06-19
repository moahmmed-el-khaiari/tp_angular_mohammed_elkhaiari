import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../models/user';
import { ReactiveFormsModule } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './admin-product.component.html',
  styleUrl: './admin-product.component.css'
})
export class AdminProductComponent implements OnInit {
  products: Product[] = [];
  product!: Product;
  users: User[] = [];
  numberOfUsers: number = 0;
  numberOfProducts: number = 0;
  productToDelete!: Product;

  constructor(private fb: FormBuilder,private productService: ProductService,private router: Router,private authService: AuthService) {

    this.promotionForm = this.fb.group({
      percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      duration: ['', Validators.required]
    });
   }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.numberOfProducts = this.products.length;
    });

    this.authService.getUsers().subscribe(users => {
      this.users = users;
      this.numberOfUsers = this.users.length;
    });
  }
  getImageUrl(product: Product){
    return product.product_image
  }

  editProduct(product: Product) {
    if (product && product.productID) {
      this.router.navigate(['/add-product', { productID: product.productID }]);
    } else {
      console.error("Impossible de récupérer l'ID du produit.");
    }
  }

  confirmDeleteProduct(product: Product): void {
    // Stocker le produit à supprimer dans une variable temporaire
    this.productToDelete = product;
    // Afficher la modal de confirmation
    $('#confirmDeleteProductModal').modal('show');
  }
  
  deleteConfirmedProduct(): void {
    // Appeler votre méthode deleteProduct pour supprimer le produit
    this.productService.deleteProduct(this.productToDelete.productID).subscribe(
      () => {
        console.log("Product successfully deleted!");
        // Supprimer le produit de la liste après la suppression réussie
        this.products = this.products.filter(p => p.productID !== this.productToDelete.productID);

        this.numberOfUsers = this.users.length;
      },
      (error) => {
        console.error("Error deleting product:", error);
      }
    );
    // Fermer la modal de confirmation après la suppression
    $('#confirmDeleteProductModal').modal('hide');
  }
  




  ngAfterViewInit(): void {
    this.initializeDataTable();
    
  }
  private initializeDataTable(): void {
    $(function () {
      $("#example1").DataTable({
        "responsive": true,
        "lengthChange": false,
        "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
      }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');

      $('#example2').DataTable({
        "paging": true,
        "lengthChange": false,
        "searching": false,
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "responsive": true,
      });
    });
  }



  promotionForm!: FormGroup;
  errorMessage!: string;
  onSubmit() {
   if (this.promotionForm.valid) {
     const { percentage, duration } = this.promotionForm.value;
     this.productService.setPromotion(percentage, duration).subscribe(
       response => {
         console.log('Promotion set successfully', response);
         this.productService.setDiscountPercentage(percentage);
       },
       error => {
         console.error('Error setting promotion', error);
         this.errorMessage = error.message ? error.message : 'Unknown error';
       }
     );
   }
 }
 

}
