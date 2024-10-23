import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReusableTableComponent } from './components/reusable-table/reusable-table.component';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { OffcanvasNavbarComponent } from './components/offcanvas-navbar/offcanvas-navbar.component';
import { NavbarMobileComponent } from './components/navbar-mobile/navbar-mobile.component';



@NgModule({
  declarations: [
    ReusableTableComponent,
    OffcanvasNavbarComponent,
    NavbarMobileComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,    
    ToastModule,        
    ConfirmDialogModule,
    MessagesModule,   
    ToolbarModule,    
   DropdownModule,    
   AccordionModule,   
    CalendarModule ,  
    FileUploadModule,
    TooltipModule,
    MultiSelectModule ,
    RippleModule,
    TranslateModule
  ],
  exports:[
    ReusableTableComponent,
    OffcanvasNavbarComponent,
    NavbarMobileComponent
  ]
})
export class SharedModule { }
