import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { panier } from '../models/panier';
import { RouterLink,Router, RouterOutlet,RouterLinkActive, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CartService } from '../cart.service';
import { Product } from '../models/product';
import { panierItem } from '../models/panierItem';
import { Commande } from '../models/Commande';
import { CommandeService } from '../commande.service';
import { ProduitCommande } from '../models/ProduitCommande';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule ,RouterLink,RouterLinkActive,RouterOutlet,FormsModule,CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cartProducts: any[] = [];
  commande!: Commande;
Cancel() {
return 5000;
}
getFinalPrice(): any {
return 6000;
}
getTotalPrice(): any {
return 7000;
}



  currentDate: Date = new Date();
  cart : panier = new panier();
  quantity: any;
  constructor(private fb : FormBuilder,private cartService: CartService,private commandeService: CommandeService){}
ngOnInit(): void {

  const currentUser = localStorage.getItem('User');
  if (currentUser) {
    this.user = JSON.parse(currentUser);
  }

  this.loadCart();

  this.form = this.fb.group({
    firstName : this.fb.control(null,[Validators.required]),
    lastName : this.fb.control(null,[Validators.required]),
    phone : this.fb.control('212 ',[Validators.required]),
    email : this.fb.control(null,[Validators.required]),
    address : this.fb.control(null,[Validators.required]),
    city : this.fb.control(null,[Validators.required]),
    postalCode : this.fb.control(null,[Validators.required]),
    message : this.fb.control(null)
  });
}

/*------------------------test1--------------------------------
createProduitCommandeList(): ProduitCommande[] {
  return this.cart.Products.map((item, index) => {
    return {
      produitCommandeId: index + 1, // ou utilisez une autre logique pour générer l'ID
      produitId: item.product.productID,
      quantity: item.quantity
    };
  });
}*/




form!: FormGroup;
generateInvoice(): void {
console.log("generateInvoice appeler ");
  const pdf = new jsPDF();
  let yPos : number = 20;
  
  pdf.setFontSize(18);
  pdf.text('Invoice',92,yPos);

  pdf.setFontSize(10);
  pdf.text(`${this.currentDate.getDate()}/${this.currentDate.getMonth()+1}/${this.currentDate.getFullYear()}  at  ${this.currentDate.getHours()}:${this.currentDate.getMinutes()}:${this.currentDate.getSeconds()}`,160,yPos+=10);

  pdf.setFontSize(13);
  pdf.text('Customer informations :',20,yPos+=10);

  pdf.setFontSize(11);
  pdf.text(`Full name :  ${this.form.value.firstName} ${this.form.value.lastName}`,20,yPos+=8);
  pdf.text(`Phone : ${this.form.value.phone}`,20,yPos+=6);
  pdf.text(`Address : ${this.form.value.address}`,20,yPos+=6);
  pdf.text(`City : ${this.form.value.city}`,20,yPos+=6);
  pdf.text(`Postal code : ${this.form.value.postalCode}`,20,yPos+=6);

  yPos += 10;
  const columns = ["", "Quantity", "Price"];
  const rows = this.cart.Products.map(item => [item.product.product_title, item.quantity, `${(item.product.product_price * item.quantity)} MAD` ]);
  rows.push(["Total", "" , `${this.totalAmount} MAD`]);
  rows.push(["TAX", "" , "+100 MAD"]);
  rows.push(["Amount to pay", "" , `${this.totalAmount+100} MAD`]);

  (pdf as any).autoTable({
    startY: yPos,
    head: [columns],
    body: rows,
    headStyles: { halign: 'center' }, // Center-align header
    //bodyStyles: { halign: 'center' }
  });
  pdf.save('invoice.pdf');

  /*---------------------suite de test 1--------------------------------------
  
  const produits: ProduitCommande[] = this.createProduitCommandeList();
  const commande: Commande = {
    userId: this.user.id,
    // Ajoutez d'autres propriétés de la commande ici en fonction de vos besoins
    products: [], // Initialisez avec un tableau vide ou la valeur par défaut appropriée
    address: this.form.value.address,
    city: this.form.value.city,
    postalCode: this.form.value.postalCode,
    totalAmount: this.totalAmount,
    dateCreated: new Date() 
  };




  this.commandeService.createCommande(commande, produits).subscribe(
    (response) => {
      console.log('Commande enregistrée avec succès :', response);
      // Redirigez ou effectuez d'autres actions après avoir enregistré la commande
    },
    (error) => {
      console.error('Erreur lors de l\'enregistrement de la commande :', error);
    }
  );*/






















  //test 2

  const commande: Commande = {
    userId: this.user.id,
    address: this.form.value.address,
    city: this.form.value.city,
    postalCode: this.form.value.postalCode,
    message: this.form.value.message,
    totalAmount: this.totalAmount,
    dateCreated: new Date(),
    produitCommandes: [], // Assurez-vous que cette propriété existe maintenant
    products: [] // Ajoutez cette propriété
  };

  const produits: ProduitCommande[] = this.cart.Products.map((item, index) => {
    return {
      produitCommandeId: index + 1, // ou utilisez une autre logique pour générer l'ID
      produitId: item.product.productID,
      quantity: item.quantity,
      commandeByCommandeId: null // Laissez cela comme null
    };
  });

  commande.products = produits; // Assignez les produits à la commande

  this.commandeService.createCommande(commande, produits).subscribe(
    (response) => {
      console.log('Commande enregistrée avec succès :', response);
      // Redirection ou autres actions après avoir enregistré la commande
    },
    (error) => {
      console.error('Erreur lors de l\'enregistrement de la commande :', error);
    }
  );
}










totalAmount: number = 0;

  products! : Array<Product>;
  user :  any;
  cartt: panierItem[] = [];

loadCart() {

  //this.cart = this.cartService.getCartByUser(6);
  //console.log(this.cart.Products);
  this.cartService.getAllCarts().subscribe({
    next : (data) => {
       let filteredItems : panierItem[] = data.filter(item => {
          return item.userId == this.user.id;
      });
      this.calculateTotalAmount();
       if(filteredItems != undefined){
          this.cart.Products  = filteredItems;
          this.calculateTotalAmount();
       }
       console.log(filteredItems);
    },
    error : (error) => {
       console.log(error);
       return error;
    }
 });





 
}

calculateTotalAmount(): void {
  // Réinitialiser le montant total
  this.totalAmount = 0;
  // Pour chaque produit du panier, calculer le montant total
  this.cart.Products.forEach((item: panierItem) => {
    this.totalAmount += item.quantity * item.product.product_price;
  });
}



removeFromCart(product: Product) {
  // Logique pour supprimer un produit du panier
}

getImageUrl(product: Product): string {
  // Méthode pour obtenir l'URL de l'image d'un produit
  return product.product_image;
}

}
