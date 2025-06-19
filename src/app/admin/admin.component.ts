import { AfterViewInit, Component } from '@angular/core';
import { User } from '../models/user';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../models/product';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements AfterViewInit {










  ngAfterViewInit(): void {
    this.initializeDataTable();
  }
  
  products: Product[] = [];
  users: User[] = [];
  numberOfUsers: number = 0;
  numberOfProducts: number = 0;
  constructor(private authService: AuthService,private router: Router,private productService: ProductService,private http: HttpClient) {

   

   }
   



  userToDelete!: User;

  ngOnInit(): void {
    
    this.authService.getUsers().subscribe(users => {
      this.users = users;
      this.numberOfUsers = this.users.length;
    });

    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.numberOfProducts = this.products.length;
    });
    
  }
  confirmDelete(user: User): void {
    // Stocker l'utilisateur à supprimer dans une variable temporaire
    this.userToDelete = user;
    // Afficher la modal de confirmation
    $('#exampleModal').modal('show');
  }
  
  deleteConfirmed(user: User): void {
    // Appeler votre méthode deleteUser pour supprimer l'utilisateur
    this.authService.deleteUser(user.userId).subscribe(() => {
      // Supprimer l'utilisateur de la liste après la suppression réussie
      this.users = this.users.filter(u => u.userId !== user.userId);

      this.numberOfUsers = this.users.length;
    }, error => {
      console.error('Erreur lors de la suppression de l\'utilisateur : ', error);
    });
    // Fermer la modal de confirmation après la suppression
    $('#exampleModal').modal('hide');
  }
  


  private initializeDataTable(): void {
    $(function () {
      $("#example1").DataTable({
        "responsive": true,
        "lengthChange": false,
        "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"],
        "paging": true, // Activer la pagination
      "pageLength": 3
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





  
}
