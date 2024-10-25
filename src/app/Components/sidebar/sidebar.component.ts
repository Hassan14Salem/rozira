import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { PermissionService } from 'src/app/Services/permission.service';
import { LanguageService } from 'src/app/Services/language.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements AfterViewInit , OnInit {
  isSidebarOpen = true; // Sidebar is open by default
  currentDirection : string ='ltr' // default dir
  isRTL:boolean =false;
  toggleSidebar() {
  }

  toggleDirection(dir:any)
  {
    if(dir === 'ltr')
    {
          this.isRTL = false;
    } else{
          this.isRTL = true;
      
    }
  }


  isLogin : boolean = false;
 constructor(private  _AuthService :AuthService, private permissionService : PermissionService,
              private _directionLanguageService:LanguageService,
              private renderer: Renderer2,
              private elRef: ElementRef

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

    this.toggleDirection(dir)
    // Additional logic can be added here if needed when direction changes
  });


  
 }
 ngAfterViewInit() {
  const offcanvasElement = this.elRef.nativeElement.querySelector('#offcanvasNavbar');
  const buttonElement = this.elRef.nativeElement.querySelector('.navbar-toggler');

  if (buttonElement && offcanvasElement) {
    // Listen for clicks on the toggle button
    this.renderer.listen(buttonElement, 'click', () => {
      setTimeout(() => {
        const isVisible = offcanvasElement.classList.contains('show');
        this.adjustPageWrapperMargin(isVisible);
      }, 300); // Adding a delay to ensure that the offcanvas state is updated
    });
  }
}
 adjustPageWrapperMargin(isVisible: boolean) {
  const pageWrapper = this.elRef.nativeElement.querySelector('#page-content-wrapper');
  if (isVisible) {
    this.renderer.setStyle(pageWrapper, 'margin-inline', '250px');
  } else {
    this.renderer.setStyle(pageWrapper, 'margin-inline', '0');
  }
}


 
}
