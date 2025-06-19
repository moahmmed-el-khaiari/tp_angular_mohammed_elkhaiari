import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  users : User[]= [];

  constructor(private http :HttpClient,  private router: Router){

    this.http.get<User[]>('http://localhost:8081/users').subscribe((data)=>{this.users = data});
    if (typeof localStorage !== 'undefined') {
      this.isLoggedInSubject.next(!!localStorage.getItem('User'));
    }
   }

   getUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:8081/users');
  }
  createtUser(user : User,adminCode?: string) : Observable<User> {

    const data = {
        username : user.username,
        email: user.email,
        password: user.password,
        userType: user.userType
    };
    return this.http.post<User>('http://localhost:8081/users/post',data);
  }

  public login(email: string , password : string) : Observable<User>{
    let user = this.users.find(u => u.email == email);
    if(user == undefined) 
      return throwError(()=>new Error("Incorrect Email!"));
    if(user.password != password)
      return throwError(()=>new Error("Incorrect Password!"));

    if (typeof localStorage !== 'undefined' && window.localStorage) {
      localStorage.removeItem("User");
      localStorage.setItem("User", JSON.stringify({ id: user.userId, username: user.username,email :user.email ,userType: user.userType, jwt: "JWT_TOKEN" }));
    }
    this.isLoggedInSubject.next(true);
    return of(user);
  }

 /* public login(email: string, password: string, adminCode?: string): Observable<User> {
    let user = this.users.find(u => u.email === email);
    if (user === undefined) 
      return throwError(() => new Error("Incorrect Email!"));
    if (user.password !== password)
      return throwError(() => new Error("Incorrect Password!"));

    // Vérifiez le code admin si l'utilisateur tente de se connecter en tant qu'admin
    if (adminCode && adminCode !== 'SECRET_ADMIN_CODE') {
      return throwError(() => new Error("Incorrect Admin Code!"));
    }

    if (adminCode === 'SECRET_ADMIN_CODE') {
      user.userType = 'Admin';
    }

    if (typeof localStorage !== 'undefined' && window.localStorage) {
      localStorage.removeItem("User");
      localStorage.setItem("User", JSON.stringify({ id: user.userId, username: user.username, email: user.email, userType: user.userType, jwt: "JWT_TOKEN" }));
    }
    this.isLoggedInSubject.next(true);
    return of(user);
  }
*/




  private isLoggedInSubject = new BehaviorSubject<boolean>(false); // Sujet observable pour l'état de connexion
  isLoggedIn$ = this.isLoggedInSubject.asObservable(); // Observable pour s'abonner aux changements





  logout() {

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('User');
      // Nettoyer le panier ici
      localStorage.removeItem('CartItems');
    }
    this.isLoggedInSubject.next(false);
    this.router.navigateByUrl('/login');
  }






  getCurrentUser(): Observable<User | null> {
    const userData = localStorage.getItem('User');
    if (userData) {
      const user = JSON.parse(userData);
      return of(user);
    } else {
      return of(null);
    }
  }



  deleteUser(userId: number): Observable<void> {
    const url = `http://localhost:8081/users/delete/${userId}`;
    return this.http.delete<void>(url);
  }
}
