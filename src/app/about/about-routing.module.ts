import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllAboutComponent } from './pages/all-about/all-about.component';

const routes: Routes = [
  {path:'all',component:AllAboutComponent,title:'About'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
