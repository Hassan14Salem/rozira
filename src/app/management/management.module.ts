import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementRoutingModule } from './management-routing.module';
import { UsersComponent } from './pages/users/users.component';
import { AdminsComponent } from './pages/admins/admins.component';
import { MainComponent } from './pages/main/main.component';
import { TabViewModule } from 'primeng/tabview';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    UsersComponent,
    AdminsComponent,
    MainComponent,
    
  ],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    TabViewModule,
    TranslateModule,
    ButtonModule,
    TableModule,
    DialogModule,
    FormsModule,
    DropdownModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ManagementModule { }
