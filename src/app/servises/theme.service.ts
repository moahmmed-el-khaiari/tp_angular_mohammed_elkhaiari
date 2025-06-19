import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'

})
export class ThemeService {
  private darkModeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  darkMode$: Observable<boolean> = this.darkModeSubject.asObservable();
 constructor() {
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      this.darkModeSubject.next(savedTheme === 'true');
      this.updateBodyClass(savedTheme === 'true');
    }
  }
}

   toggleTheme() {
    const newMode = !this.darkModeSubject.value;
    this.darkModeSubject.next(newMode);
    this.updateBodyClass(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  }
    private updateBodyClass(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
  
}
