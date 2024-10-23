import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private currentLang = new BehaviorSubject<string>('en'); // Default language
  currentLang$ = this.currentLang.asObservable();

  private currentDir = new BehaviorSubject<string>('ltr'); // Default direction
  currentDir$ = this.currentDir.asObservable();

  constructor(private translate: TranslateService) {
    // Get language and direction from localStorage (if available)
    const storedLang = localStorage.getItem('lang') || 'en';
    const storedDir = localStorage.getItem('dir') || 'ltr';

    // Set the initial language and direction
    this.currentLang.next(storedLang);
    this.currentDir.next(storedDir);

    // Make sure TranslateService uses the stored language
    this.translate.setDefaultLang(storedLang);
    this.translate.use(storedLang);

    // Set the language and direction to the stored values
    document.documentElement.lang = storedLang;
    document.documentElement.dir = storedDir;
  }

  changeLanguage(lang: string) {
    this.translate.use(lang); // Update translation language
    this.currentLang.next(lang); // Broadcast the new language
    localStorage.setItem('lang', lang);

    // Set direction based on language (assuming Arabic is RTL, others are LTR)
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    this.currentDir.next(dir); // Broadcast the new direction

    localStorage.setItem('dir', dir);

    // Update the HTML element's direction attribute
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }

  getDirection(): string {
    return localStorage.getItem('dir') || 'ltr';
  }
}
