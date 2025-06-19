import { Component } from '@angular/core';
import { RouterLink,RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { CatalogComponentComponent} from './catalog-component/catalog-component.component';
import { CartDetailComponent } from './cart-detail/cart-detail.component';
import { FooterComponent } from './footer/footer.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule,RouterLink,HeaderComponent,HomeComponent,CatalogComponentComponent,CartDetailComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'TP4Angular';
}
