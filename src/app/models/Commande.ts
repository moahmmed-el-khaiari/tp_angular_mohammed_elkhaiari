import { ProduitCommande } from './ProduitCommande';
import { Product } from './product';

export interface Commande {
    
  userId: number;
  address: string;
  city: string;
  postalCode: string;
  message?: string;
  totalAmount: number;
  dateCreated?: Date;
  produitCommandes?: ProduitCommande[];
  products?: ProduitCommande[];
}
