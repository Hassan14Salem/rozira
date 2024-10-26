import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { PermissionService } from 'src/app/Services/permission.service';
import { LanguageService } from 'src/app/Services/language.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements AfterViewInit, OnInit {
  navItems = [
    { label: 'sideMenu.dashboard', icon: 'fa-solid fa-chart-line', route: '/dashboard', permission: 'SendOtp' },
    { label: 'sideMenu.users', icon: 'fa-solid fa-users', route: '/users', permission: 'ViewUsers' },
    { label: 'sideMenu.myProfile', icon: 'fa-solid fa-user', route: '/profile', permission: 'GetContactusById' },
    { label: 'sideMenu.permissions', icon: 'fa-solid fa-question', route: '/permissions/all', permission: 'ViewRoles' },
    { label: 'sideMenu.product', icon: 'fa-brands fa-product-hunt', route: '/product/products', permission: 'GetProducts' },
    { label: 'sideMenu.about', icon: 'fa-solid fa-address-card', route: '/about/all', permission: 'GetAboutus' },
    { label: 'sideMenu.sliders', icon: 'fa-solid fa-sliders', route: '/sliders/all', permission: 'ViewSliders' },
    { label: 'sideMenu.category', icon: 'fa-solid fa-layer-group', route: '/category/all', permission: 'GetCategories' },
    { label: 'sideMenu.contactUs', icon: 'fa-solid fa-address-book', route: '/contactUs', permission: 'GetContactus' },
    { label: 'sideMenu.logout', icon: 'fa-solid fa-outdent', route: '/logout', action: 'logout()' } // Use an action instead of route for logout
  ];

  isSidebarOpen = true; // Sidebar is open by default
  currentDirection: string = 'ltr' // default dir
  isRTL: boolean = false;
  toggleSidebar() {
  }

  toggleDirection(dir: any) {
    if (dir === 'ltr') {
      this.isRTL = false;
    } else {
      this.isRTL = true;

    }
  }


  isLogin: boolean = false;
  constructor(private _AuthService: AuthService, private permissionService: PermissionService,
    private _directionLanguageService: LanguageService,
    private renderer: Renderer2,
    private elRef: ElementRef

  ) {
    this.loadPermissions();
    _AuthService.userProfile.subscribe({
      next: () => {
        if (_AuthService.userProfile.getValue() !== null) {
          this.isLogin = true;
        }
        else {
          this.isLogin = false;
        }
      }
    });
  }
  logout() {
    this._AuthService.logout();
    this.isSidebarOpen = false; // Sidebar is open by default
    this.isLogin = false; //


  }

  

  changeLanguage(lang: string) {
    this._directionLanguageService.changeLanguage(lang);
  }

  permissionsLoaded = false;
  permissions: string[] = [];
  hasPermission(permission: any): boolean {
    return this.permissions.includes(permission);

  }
  loadPermissions() {
    const storedPermissions = localStorage.getItem('userPermissions');
    if (storedPermissions) {
      this.permissions = JSON.parse(storedPermissions);
      this.permissionsLoaded = true;
    } else {
      this._AuthService.permissions$.subscribe((permissions) => {
        this.permissions = permissions;
        this.permissionsLoaded = true;
        localStorage.setItem('userPermissions', JSON.stringify(permissions));
      });
    }
  }
  ngOnInit(): void {

    this.loadPermissions();
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
