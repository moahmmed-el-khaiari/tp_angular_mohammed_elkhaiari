import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from './models/user';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:3000/api';
  private user: BehaviorSubject<User | null>;

  constructor(private http: HttpClient) {
    this.user = new BehaviorSubject<User | null>(null);
  }

  getUser(): Observable<User | null> {
    return this.user;
  }

}