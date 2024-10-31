import { Component, OnInit, NgModule } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Route } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/Services/auth.service';
import { RolesService } from 'src/app/Services/roles.service';
import { UsersService } from 'src/app/Services/users.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'],
  providers: [MessageService],
})
export class UserprofileComponent implements OnInit {
  username: any;
  userID: any;
  permissionsLoaded = false;
  permissions: string[] = [];
  roles: any[] = [];


  editUserForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]),
  });
  editEmailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  editPhneNumForm = new FormGroup({

    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/)]),
  });

  editRoleForm = new FormGroup({
    role: new FormControl('', [Validators.required, Validators.pattern(/(Admin|User)/)])
  });


  passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
    const formGroup = control as FormGroup;
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { mismatch: true };
  };

  changePasswordForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      oldPassword: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(25)]),
    },
    { validators: this.passwordMatchValidator } // Bind context if validator is a method
  );
  userinfo!: User;

  editUserNameV: boolean = false;
  editPhonenumberV: boolean = false;
  editRoleV: boolean = false;
  editEmailV: boolean = false;

  changePasswordV: boolean = false;
  constructor(private _UserService: UsersService,
    private _AuthService: AuthService,
    private _roles: RolesService,
    private _alert: ToastrService,
    private _messageService: MessageService
  ) { }

  contactValus: any[] = [];
  ngOnInit(): void {
    this.loadPermissions();
    this.getUserName();
    this.getAllRoles();
  }

  hasPermission(permission: any): boolean {
    return this.permissions.includes(permission);
  }
  getAllRoles() {
    this._roles.getRoles().subscribe({
      next: (Respose) => {
        this.roles = Respose;
      }
    })
  }
  loadPermissions() {
    const storedPermissions = localStorage.getItem('userPermissions');

    if (storedPermissions) {
      this.permissions = JSON.parse(storedPermissions);
      this.permissionsLoaded = true;
    } else {
      this._AuthService.permissions$.subscribe((permissions) => {
        this.permissions = permissions;
        this.permissionsLoaded = true;
        localStorage.setItem('userPermissions', JSON.stringify(permissions));
      });
    }
  }
  getUserName() {
    const stordName = localStorage.getItem('RoziraToken');
    if (stordName) {
      this.username = this._AuthService.decodeUserToken();
      this._UserService.getUserByUsername(this.username).subscribe({
        next: (response: User) => {
          this.userinfo = response;
        },
        error: (myError) => {
        },
      });
    }
  }

  openUserForm() {
    this.editUserNameV = true;
    this.editUserForm.patchValue(this.userinfo);
  }
  editUserName(data: FormGroup) {

    if (data) {
      const formValues = {
        ...this.editUserForm.value,
        userId: this.userinfo.userId,
        role: this.userinfo.role,
        phoneNumber: this.userinfo.phoneNumber,
        email: this.userinfo.email
      };


      this._UserService.editUser(formValues).subscribe({
        next: (Response) => {
          this._messageService.add({ severity: 'success', summary: 'Username', detail: 'Updated Successfully' });
          this.editUserNameV = false;
          this.editUserForm.reset();
          setTimeout(() => {
            this._AuthService.logout();
          }, 3000);
        },
        error: (error) => {
          this._alert.error('Faild to Update User')
          if (error.status === 400 && error.error.errors) {
            // Extract and display validation errors from the response
            const validationErrors = error.error.errors;
            for (const key in validationErrors) {
              if (validationErrors.hasOwnProperty(key)) {
                // Optionally, display these errors in your UI
              }
            }
          }
        }
      });
    } else {
      this.editUserForm.markAllAsTouched(); // Trigger form validation messages
    }
  }


  openEmailForm() {
    this.editEmailV = true;
    this.editEmailForm.patchValue(this.userinfo);
  }
  editEmail(data: FormGroup) {
    if (data) {
      const formValues = {
        ...this.editEmailForm.value,
        userId: this.userinfo.userId,
        role: this.userinfo.role,
        phoneNumber: this.userinfo.phoneNumber,
        userName: this.username
      };


      this._UserService.editUser(formValues).subscribe({
        next: (Response) => {
          this._messageService.add({ severity: 'success', summary: 'Email', detail: 'Updated Successfully' });
          this.editEmailV = false;
          this.editEmailForm.reset();
          setTimeout(() => {
            this._AuthService.logout();
          }, 3000);
        },
        error: (error) => {
          this._alert.error('Faild to Update User')
          if (error.status === 400 && error.error.errors) {
            // Extract and display validation errors from the response
            const validationErrors = error.error.errors;
            for (const key in validationErrors) {
              if (validationErrors.hasOwnProperty(key)) {
                // Optionally, display these errors in your UI
              }
            }
          }
        }
      });
    } else {
      this.editUserForm.markAllAsTouched(); // Trigger form validation messages
    }
  }



  openPhoneForm() {
    this.editPhonenumberV = true;
    this.editPhneNumForm.patchValue(this.userinfo);
  }

  editPhone(data: FormGroup) {

    if (data) {
      const formValues = {
        ...this.editPhneNumForm.value,
        userId: this.userinfo.userId,
        role: this.userinfo.role,
        email: this.userinfo.email,
        userName: this.username
      };


      this._UserService.editUser(formValues).subscribe({
        next: (Response) => {
          this._messageService.add({ severity: 'success', summary: 'Phone number', detail: 'Updated Successfully' });
          this.editPhonenumberV = false;
          this.editPhneNumForm.reset();
          setTimeout(() => {
            this._AuthService.logout();
          }, 3000);
        },
        error: (error) => {
          this._alert.error('Faild to Update User')
          if (error.status === 400 && error.error.errors) {
            // Extract and display validation errors from the response
            const validationErrors = error.error.errors;
            for (const key in validationErrors) {
              if (validationErrors.hasOwnProperty(key)) {
                // Optionally, display these errors in your UI
              }
            }
          }
        }
      });
    } else {
      this.editUserForm.markAllAsTouched(); // Trigger form validation messages
    }
  }


  openRoleForm() {
    this.editRoleV = true;
    this.editRoleForm.patchValue(this.userinfo);
  }


  editRole(data: FormGroup) {
    if (data) {
      const formValues = {
        ...this.editRoleForm.value,
        userId: this.userinfo.userId,
        phoneNumber: this.userinfo.phoneNumber,
        email: this.userinfo.email,
        userName: this.username
      };


      this._UserService.editUser(formValues).subscribe({
        next: (Response) => {
          this._messageService.add({ severity: 'success', summary: 'Role', detail: 'Updated Successfully' });
          this.editRoleV = false;
          this.editRoleForm.reset();
          setTimeout(() => {
            this._AuthService.logout();
          }, 3000);

        },
        error: (error) => {
          this._alert.error('Faild to Update User')
          if (error.status === 400 && error.error.errors) {
            // Extract and display validation errors from the response
            const validationErrors = error.error.errors;
            for (const key in validationErrors) {
              if (validationErrors.hasOwnProperty(key)) {
                // Optionally, display these errors in your UI
              }
            }
          }
        }
      });
    } else {
      this.editRoleForm.markAllAsTouched(); // Trigger form validation messages
    }
  }


  openChangePasswordForm() {
    this.changePasswordV = true;
  }

  changePassword(data: FormGroup) {
   }






}
