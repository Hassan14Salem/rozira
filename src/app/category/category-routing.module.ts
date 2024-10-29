import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllCategoryComponent } from './Pages/all-category/all-category.component';

const routes: Routes = [
  {path:'all',component:AllCategoryComponent,title:'All Categories'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
