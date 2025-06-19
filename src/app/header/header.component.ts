import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../models/user';
import { AuthService } from '../auth.service';
import { Observable, Subscription } from 'rxjs';
import { ThemeService } from '../servises/theme.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  currentUser: User | null = null;
 /* isLoggedIn!: boolean;*/
  showSignOutMenu: boolean = false;
  user: any;
  showProfileDetails: boolean = false;
  isDarkMode: boolean = false;

  constructor(private userService: UserService,private authService: AuthService, private themeService: ThemeService) {    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
  }
  toggleTheme() {
    this.themeService.toggleTheme();
  }
  ngOnInit() {
  /*  this.userService.getUser().subscribe({
      next: (user) => { this.user = user }
    })*/
    this.authSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.authService.getCurrentUser().subscribe(user => {
          this.currentUser = user;
        });
      } else {
        this.currentUser = null;
      }
    });




    if (typeof localStorage !== 'undefined') {
      const userData = localStorage.getItem('User');
      if (userData) {
        console.log("User data found in local storage", userData);
        this.user = JSON.parse(userData);
      }
    } else {
      console.error('localStorage is not available.');
    }
    
  }

  toggleSignOutMenu() {
    this.showSignOutMenu = !this.showSignOutMenu;
  }

 /* signOut() {
    this.userService.signOut();
    this.showSignOutMenu = false;
  }*/

  isLoggedIn: boolean = false;
  private authSubscription!: Subscription;

  logout(): void {
    this.authService.logout();
    
  }
  toggleProfileDetails() {
    this.showProfileDetails = !this.showProfileDetails;
  }

}
