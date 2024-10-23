import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { NotfoundComponent } from './Components/notfound/notfound.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { CreatenewComponent } from './Components/createnew/createnew.component';
import { UsersComponent } from './Components/users/users.component';
import { authGuard } from './Guards/auth.guard';
import { preventURLBackGuard } from './Guards/prevent-urlback.guard';
import { UserprofileComponent } from './Components/userprofile/userprofile.component';
import { ProductsComponent } from './Components/products/products.component';
import { CreateSlidersComponent } from './Components/create-sliders/create-sliders.component';
import { ContactUsDetailsComponent } from './Components/contact-us-details/contact-us-details.component';
import { CategoriesComponent } from './Components/categories/categories.component';
import { PermissionComponent } from './permissions/pages/permission/permission.component';

const routes: Routes = [
  {path:'', redirectTo:'dashboard',pathMatch:'full' , title:'Dashboard'},
  {path:'login',canActivate:[preventURLBackGuard],component:LoginComponent,title:'Login'},
  {path:'dashboard',canActivate:[authGuard],component:DashboardComponent, title:'Home'},
  {path:'newMerchent',canActivate:[authGuard],component:CreatenewComponent,title:'Create new user'},
  {path:'users',canActivate:[authGuard],component:UsersComponent,title:'All Users'},
  {path:'profile',canActivate:[authGuard],component:UserprofileComponent,title:'Profile'},
  {path:'products',canActivate:[authGuard],component:ProductsComponent,title:'Products'},
  {path:'createSlider',canActivate:[authGuard],component:CreateSlidersComponent,title:'Create Slider'},
  {path:'contactUs',canActivate:[authGuard],component:ContactUsDetailsComponent,title:'Contact US'},
  {path:'categories',canActivate:[authGuard],component:CategoriesComponent,title:'Categories'},
  {path:'product',loadChildren:() => import('./product/product.module').then(p => p.ProductModule)},
  {path:'category',loadChildren:() => import('./category/category.module').then(c => c.CategoryModule)},
  {path:'about',loadChildren:() => import('./about/about.module').then(a => a.AboutModule)},
  {path:'sliders',loadChildren:() => import('./sliders/sliders.module').then(s => s.SlidersModule)},
  // {path:'permissions',loadChildren:() => import('./permissions/permissions.module').then(s => s.PermissionsModule)},

  {path:'permissions/all',component:PermissionComponent},
  {path:'**',component:NotfoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
