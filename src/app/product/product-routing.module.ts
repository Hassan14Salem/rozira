import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllProductComponent } from './pages/all-product/all-product.component';
import { UpdateProductComponent } from './pages/update-product/update-product.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';

const routes: Routes = [
  {path:'products',component:AllProductComponent,title:'All Products'},
  {path:'update/:id',component:UpdateProductComponent,title:'Update Product'},
  {path:'details/:id',component:ProductDetailsComponent,title:'Details of Product'},
  {path:'add',component:AddProductComponent,title:'Add Products'},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
