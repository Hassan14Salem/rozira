import { Component, Input, OnInit, Output } from '@angular/core';
import { LanguageService } from 'src/app/Services/language.service';

@Component({
  selector: 'app-offcanvas-navbar',
  templateUrl: './offcanvas-navbar.component.html',
  styleUrls: ['./offcanvas-navbar.component.css']
})
export class OffcanvasNavbarComponent implements OnInit {
  selectedLanguageText:string = "English";
  selectedLanguageFlag:string ="assets/images/flags/us.png";

  constructor(private _directionLanguageService:LanguageService){}

@Input() isopen:boolean = false;

  changeLanguage(lang: string) {
    this._directionLanguageService.changeLanguage(lang);
    let language :any;
    if('lang' in localStorage){
      language = localStorage.getItem('lang')
    console.log('language from nav',language)

     }
    if(language==='en'){
      this.selectedLanguageText = "English"
      this.selectedLanguageFlag = 'assets/images/flags/us.png'
    } else if( language ==='ar'){
     
        this.selectedLanguageText = "Arabic"
      this.selectedLanguageFlag = 'assets/images/flags/eg.png'
    }
    }


    ngOnInit(): void {
      let language :any;
      if('lang' in localStorage){
        language = localStorage.getItem('lang')
      console.log('language from nav',language)
      this.changeLanguage(language)
  
       }
    }
}
