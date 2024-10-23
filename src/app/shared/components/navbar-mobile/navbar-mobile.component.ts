import { Component } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-navbar-mobile',
  templateUrl: './navbar-mobile.component.html',
  styleUrls: ['./navbar-mobile.component.css']
})
export class NavbarMobileComponent {
  isLogin!: boolean;
  constructor(private _AuthService:AuthService,
    
  ){
    _AuthService.userProfile.subscribe({
      next:()=>{
        if(_AuthService.userProfile.getValue() !== null){
          this.isLogin = true;
        }
        else{
          this.isLogin =false;
        }
      }
    });
  }
  logout(){
    this._AuthService.logout();
    this.isLogin =false; //
  
   }
}
