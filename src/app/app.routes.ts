import { Routes } from '@angular/router';
import { CatalogComponentComponent } from './catalog-component/catalog-component.component';
import { ProductDetailsComponent } from './product-details-component/product-details-component.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';
import { CartDetailComponent } from './cart-detail/cart-detail.component';
import { AddProductComponent } from './add-product/add-product.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AdminComponent } from './admin/admin.component';
import { AdminProductComponent } from './admin-product/admin-product.component';
import { AdminCommandeComponent } from './admin-commande/admin-commande.component';



export const routes: Routes = [
   // { path: '', component: LoginComponent },
   // { path: '', component: CatalogComponent },
   { path: 'catalog', component: CatalogComponentComponent },
    { path: 'login', component: LoginComponent },
    { path: 'Admin', component: AdminComponent },
    { path: 'AdminProduct', component: AdminProductComponent },
    { path: 'commande', component: AdminCommandeComponent},
    { path: 'api/login', redirectTo: '/login', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'products-details', component: ProductDetailsComponent },
{ path: 'cart', component: CartComponent },
    { path: 'products/:catalog', component: HomeComponent },
    { path: 'detail/:id/:category', component: DetailComponent },
    { path: 'cartdetail', component: CartDetailComponent },
    { path: 'add-product', component: AddProductComponent },
    { path: 'add-product/:productID', component: AddProductComponent },
    { path: 'checkout', component: CheckoutComponent},
    {path :'' ,redirectTo:'/home',pathMatch:'prefix'},
    
];
