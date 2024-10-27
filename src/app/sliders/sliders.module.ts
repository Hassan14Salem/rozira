import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlidersRoutingModule } from './sliders-routing.module';
import { AllSlidersComponent } from './Pages/all-sliders/all-sliders.component';
import { AddSliderComponent } from './Pages/add-slider/add-slider.component';
import { UpdateSliderComponent } from './Pages/update-slider/update-slider.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { SharedModule } from '../shared/shared.module';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
  declarations: [
    AllSlidersComponent,
    AddSliderComponent,
    UpdateSliderComponent
  ],
  imports: [
    CommonModule,
    SlidersRoutingModule,
    FormsModule,
    SharedModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    FileUploadModule,
    DialogModule,
    TableModule,
    TranslateModule,
    TooltipModule
  ]
})
export class SlidersModule { }
