import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { PermissionService } from 'src/app/Services/permission.service';
import { LanguageService } from 'src/app/Services/language.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isSidebarOpen = true; // Sidebar is open by default
  currentDirection : string ='ltr' // default dir
  toggleSidebar() {
  }


  isLogin : boolean = false;
 constructor(private  _AuthService :AuthService, private permissionService : PermissionService,
              private _directionLanguageService:LanguageService

 )
 {

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
  this.isSidebarOpen = false; // Sidebar is open by default
  this.isLogin =false; //


 }
 
 hasPermission(permission: string): boolean {
  return this.permissionService.hasPermission(permission);
}

changeLanguage(lang: string) {
  this._directionLanguageService.changeLanguage(lang);
  }
 ngOnInit(): void {
  this.isSidebarOpen = true;
  this._directionLanguageService.currentLang$.subscribe(lang => {
    console.log('Language changed to:', lang);
  });

  this._directionLanguageService.currentDir$.subscribe(dir => {
    console.log('Direction changed to:', dir);
    this.currentDirection = dir
    // Additional logic can be added here if needed when direction changes
  });
 }
}
