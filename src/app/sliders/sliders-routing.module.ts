import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllSlidersComponent } from './Pages/all-sliders/all-sliders.component';
import { UpdateSliderComponent } from './Pages/update-slider/update-slider.component';
import { AddSliderComponent } from './Pages/add-slider/add-slider.component';

const routes: Routes = [
  {path:'all',component:AllSlidersComponent,title:'All Sliders'},
  {path:'update',component:UpdateSliderComponent},
  {path:'add',component:AddSliderComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SlidersRoutingModule { }
