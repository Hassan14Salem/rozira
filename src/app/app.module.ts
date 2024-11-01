import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { LoginComponent } from './Components/login/login.component';
import { NotfoundComponent } from './Components/notfound/notfound.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { CreatenewComponent } from './Components/createnew/createnew.component';
import { UsersComponent } from './Components/users/users.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserprofileComponent } from './Components/userprofile/userprofile.component';
import { ProductsComponent } from './Components/products/products.component';
import { CreateSlidersComponent } from './Components/create-sliders/create-sliders.component';
import { CategoriesComponent } from './Components/categories/categories.component';
import { ContactUsDetailsComponent } from './Components/contact-us-details/contact-us-details.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule} from 'primeng/inputtext';
import { ToastModule} from 'primeng/toast';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
import { MessagesModule} from 'primeng/messages';
import { ToolbarModule } from 'primeng/toolbar'; // Import ToolbarModule
import {DropdownModule  } from 'primeng/dropdown';
import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab
import { CalendarModule} from 'primeng/calendar';
import { FileUploadModule} from 'primeng/fileupload';
import {TooltipModule} from 'primeng/tooltip';
import { MultiSelectModule } from 'primeng/multiselect';
import { RippleModule } from 'primeng/ripple';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './shared/shared.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuthInterceptor } from './Intserceptors/auth.interceptor';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { ForgettPasswordComponent } from './Components/forgett-password/forgett-password.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    SidebarComponent,
    AppComponent,
    LoginComponent,
    NotfoundComponent,
    
    CreatenewComponent,
    UsersComponent,
    UserprofileComponent,
    ProductsComponent,
    CreateSlidersComponent,
    CategoriesComponent,
    ForgettPasswordComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    DashboardComponent,
    ContactUsDetailsComponent,
    FormsModule,
    ToastrModule.forRoot({ 
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    // Not auto Imported
    HttpClientModule,
    NgbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
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
        SharedModule,
        LoadingBarRouterModule,
        LoadingBarModule

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true // This allows multiple interceptors to be registered
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
