import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionsRoutingModule } from './permissions-routing.module';
import { PermissionComponent } from './pages/permission/permission.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { TestComponent } from './pages/test/test.component';


@NgModule({
  declarations: [
    PermissionComponent,
    TestComponent
    ],
  imports: [
    CommonModule,
    PermissionsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule ,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ToolbarModule,
    CommonModule,
    TableModule,
    RatingModule ,
    TagModule,
    DropdownModule,
    ToastModule,
    RippleModule,
    ButtonModule,
    ConfirmDialogModule
  ]
})
export class PermissionsModule { }
