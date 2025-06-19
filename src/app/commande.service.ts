import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Commande } from './models/Commande';
import { Observable } from 'rxjs';
import { ProduitCommande } from './models/ProduitCommande';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {

  private apiUrl = 'http://localhost:8081/api/commandes'; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) { }

  createCommande(commande: Commande, produits: ProduitCommande[]): Observable<Commande> {
    // Assurez-vous que le nom des propriétés correspond à ce que le backend attend
  /*  const body = {
      commande: commande,
      produits: produits
    };
    return this.http.post<Commande>(`${this.apiUrl}/create`, body);
  }*/

  const commandeDto = {
    commande: commande,
    produits: produits.map(produit => ({
      produitId: produit.produitId,
      quantity: produit.quantity
    }))
  };
  return this.http.post<Commande>(`${this.apiUrl}/create`, commandeDto);
}


getAllCommandes(): Observable<Commande[]> {
  return this.http.get<Commande[]>(this.apiUrl);
}

getAllproductCommandes(): Observable<Commande[]> {
  return this.http.get<Commande[]>(`${this.apiUrl}/produitcommande`);
}
}
