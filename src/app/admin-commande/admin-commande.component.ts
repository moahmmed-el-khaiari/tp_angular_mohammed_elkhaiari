import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../models/product';
import { ProductService } from '../product.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../models/user';
import { ReactiveFormsModule } from '@angular/forms';
import { Commande } from '../models/Commande';
import { CommandeService } from '../commande.service';

@Component({
  selector: 'app-admin-commande',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './admin-commande.component.html',
  styleUrl: './admin-commande.component.css'
})
export class AdminCommandeComponent {

  commandes!: Commande[];
  produitCommandes: any[] = [];
  products: Product[] = [];
  product!: Product;
  users: User[] = [];
  numberOfUsers: number = 0;
  numberOfProducts: number = 0;
  numberOfCommande:number=0;
  productToDelete!: Product;
  produitsMap: { [key: number]: Product } = {};
  productsByUser: { [key: number]: any[] } = {};

  constructor(private commandeService: CommandeService,private productService: ProductService,private router: Router,private authService: AuthService) { }

  ngOnInit(): void {

    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.numberOfProducts = this.products.length;
    });

    this.authService.getUsers().subscribe(users => {
      this.users = users;
      this.numberOfUsers = this.users.length;
    });



    this.loadCommandes();
    this.loadProduitCommandes();
    this.loadProduitsDetails();
    this.loadUsers();
  }

  loadCommandes() {
    this.commandeService.getAllCommandes().subscribe(commandes => {
      this.commandes = commandes;
      
    });
  }
  numberOfCommandes: number = 0;
  loadProduitCommandes() {
    this.commandeService.getAllproductCommandes().subscribe(produitCommandes => {
      this.produitCommandes = produitCommandes;
      this.groupProductsByUser();
      this.numberOfCommandes = produitCommandes.length;
    });
  }

  loadProduitsDetails(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  groupProductsByUser() {
    this.productsByUser = this.produitCommandes.reduce((acc, produitCommande) => {
      const userId = produitCommande.commandeByCommandeId.userId;
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(produitCommande);
      return acc;
    }, {});
  }

  getProduitDetails(produitId: number) {
    return this.products.find(product => product.productID === produitId);
  }

}
