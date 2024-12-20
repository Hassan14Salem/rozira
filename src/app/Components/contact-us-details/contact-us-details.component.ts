import { Component, OnInit, NgModule, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';    // Import ToastModule for p-toast
import { ConfirmationService, MessageService } from 'primeng/api';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ContatusServiceService } from 'src/app/Services/contatus-service.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-contact-us-details',
  templateUrl: './contact-us-details.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    ToastModule,
    RippleModule,
    ConfirmDialogModule,
    ButtonModule,
    TableModule,
    ToolbarModule,
    DialogModule
  ],
  styleUrls: ['./contact-us-details.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService, ConfirmationService]
})
export class ContactUsDetailsComponent {
  permissions: string[] = [];
  contactValus: any[] = [];
  contactList: any[] = ['facebook', 'whatsapp', 'instagram', 'phone', 'email', 'snapchat', 'location'];
  CreateNew: boolean = false;
  editExist: boolean = false;
  permissionsLoaded = false;
  permissionss: string[] = [];

  constructor(private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _contactService: ContatusServiceService,
    private _AuthService: AuthService
  ) {

  }
  contactForm = new FormGroup({

    //email: new FormControl('', [Validators.required, Validators.email]),

    methodName: new FormControl('', Validators.required),
    contactValue: new FormControl('', [Validators.required, Validators.minLength(3)])
  });


  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  
  // get all permissions by user
  loadPermissions() {
    const storedPermissions = localStorage.getItem('userPermissions');

    if (storedPermissions) {
      this.permissions = JSON.parse(storedPermissions);
      this.permissionsLoaded = true;
    } else {
      this._AuthService.permissions$.subscribe((permissions) => {
        this.permissionss = permissions;
        this.permissionsLoaded = true;
        localStorage.setItem('userPermissions', JSON.stringify(permissions));
      });
    }
  }


  ngOnInit(): void {
    this.loadContactUs();
    this.loadPermissions();
  }
  onSubmit(): void {
    const formData = this.contactForm.value;
    if (this.contactForm.valid) {
      this._contactService.addNewMethos(formData).subscribe({
        next: (response) => {
          this.CreateNew = false;
          this.loadContactUs();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Aded succssesfully' });
          this.contactForm.reset();
        },
        error: (myError) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ُEnter a valid data' });

        },

      });
    }
  }

  loadContactUs() {
    this._contactService.getAllContactMethods().subscribe({
      next: (response) => {
        this.contactValus = response;

      },
      error: (myError) => {
      }

    });
  }

  getIconForMethod(methodName: string): string {
    switch (methodName.toLowerCase()) {
      case 'phone':
        return 'fas fa-phone';       // Font Awesome phone icon
      case 'whatsapp':
        return 'fab fa-whatsapp';    // Font Awesome WhatsApp icon
      case 'email':
        return 'fas fa-envelope';    // Font Awesome envelope (email) icon
      case 'facebook':
        return 'fab fa-facebook';    // Font Awesome Facebook icon
      case 'instagram':
        return 'fab fa-instagram';   // Font Awesome Instagram icon
      case 'snapchat':
        return 'fab fa-snapchat';    // Font Awesome Snapchat icon
      case 'location':
        return 'fas fa-map-marker-alt'; // Font Awesome map marker (location) icon
      default:
        return 'fas fa-info-circle'; // Fallback Font Awesome info-circle icon
    }
  }
  editForm = new FormGroup({

    methodName: new FormControl('', Validators.required),
    contactValue: new FormControl('', [Validators.required, Validators.minLength(3)])
  });
  theSelectedId: any;
  editContact(contact: any) {
    this.editExist = true;
    this.theSelectedId = contact.id;

    this.editForm.patchValue({
      methodName: contact.methodName,
      contactValue: contact.contactValue
    });

  }
  onEdiitSubmit() {
    const formData = this.editForm.value;
    if (this.editForm.valid) {
      this._contactService.editMethod(this.theSelectedId, formData).subscribe({
        next: (response) => {
          this.editExist = false;
          this.loadContactUs();
          this.messageService.add({ severity: 'success', summary: 'Error', detail: 'ُUser Updated' });

          this.contactForm.reset();
        },
        error: (myError) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ُEnter a valid data' });

        },

      });
    }
  }

  deleteContact(contact: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._contactService.deleteMethod(contact).subscribe({
          next: (response) => {
            this.loadContactUs();
            this.messageService.add({ severity: 'error', summary: 'Success', detail: 'Deleted succssesfully' });
          },
          error: (myError) => {
          },

        });
      }
    });
  }

  openNew() {
    this.CreateNew = true
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'added succssesfully' });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message Failed' });
  }

}
