import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { AllProductComponent } from './pages/all-product/all-product.component';
import { SharedModule } from '../shared/shared.module';
import { UpdateProductComponent } from './pages/update-product/update-product.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { CarouselModule } from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [
    AllProductComponent,
    UpdateProductComponent,
    AddProductComponent,
    ProductDetailsComponent,
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    FileUploadModule,
    TooltipModule,
    TableModule,
    DialogModule,
    CarouselModule 
    
  ]
})
export class ProductModule { }
