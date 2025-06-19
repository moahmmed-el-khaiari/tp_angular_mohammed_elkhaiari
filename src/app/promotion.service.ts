import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor() { }
  private discountPercentageSubject = new BehaviorSubject<number>(0);
  discountPercentage$ = this.discountPercentageSubject.asObservable();

  setDiscountPercentage(percentage: number) {
    this.discountPercentageSubject.next(percentage);
  }
}
