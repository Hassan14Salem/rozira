import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllProductComponent } from './pages/all-product/all-product.component';
import { UpdateProductComponent } from './pages/update-product/update-product.component';
import { AddProductComponent } from './pages/add-product/add-product.component';

const routes: Routes = [
  {path:'products',component:AllProductComponent},
  {path:'update/:id',component:UpdateProductComponent},
  {path:'add',component:AddProductComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
