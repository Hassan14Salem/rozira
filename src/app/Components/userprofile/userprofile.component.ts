import { Component, OnInit, NgModule } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/Services/auth.service';
import { RolesService } from 'src/app/Services/roles.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  username: any;
  permissionsLoaded = false;
  permissions: string[] = [];
  roles: any[] = [];
  editUserForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/)]),
    role: new FormControl('', [Validators.required, Validators.pattern(/(Admin|User)/)])
  });
  userinfo!: User;

  editUserNameV: boolean = false;
  constructor(private _UserService: UsersService,
    private _AuthService: AuthService,
    private _FormBuilder: FormBuilder,
    private _roles: RolesService,
    private _alert: ToastrService
  ) { }

  contactValus: any[] = [];
  ngOnInit(): void {
    this.loadPermissions();
    this.getUserName();
    this.getAllRoles();
    console.log(this.permissions)
  }

  hasPermission(permission: any): boolean {
    return this.permissions.includes(permission);
  }
  getAllRoles() {
    this._roles.getRoles().subscribe({
      next: (Respose) => {
        console.log(Respose)
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
      console.log(stordName)
      this.username = this._AuthService.decodeUserToken();
      console.log(this.username)
      this._UserService.getUserByUsername(this.username).subscribe({
        next: (response: User) => {
          console.log(response);
          this.userinfo = response;
        },
        error: (myError) => {
          console.log(myError)
        },
      });
    }
  }
  openUserForm() {
    this.editUserNameV = true;
    this.editUserForm.patchValue(this.userinfo);
  }
  editUserName(data: FormGroup) {

    console.log('user to update', data);
    if (data) {
      const formValues = this.editUserForm.value;

      console.log('Submitting form with values:', formValues);

      this._UserService.editUser(formValues).subscribe({
        next: (Response) => {
          console.log(Response);
          this._alert.success('User updated successfully!')
        },
        error: (error) => {
          this._alert.error('Faild to Update User')
          console.log(error)
          if (error.status === 400 && error.error.errors) {
            // Extract and display validation errors from the response
            const validationErrors = error.error.errors;
            for (const key in validationErrors) {
              if (validationErrors.hasOwnProperty(key)) {
                console.error(`${key}: ${validationErrors[key].join(', ')}`);
                // Optionally, display these errors in your UI
              }
            }
          }
        }
      });
    } else {
      console.error('Form is invalid');
      this.editUserForm.markAllAsTouched(); // Trigger form validation messages
    }
  }
  editEmail(data: FormGroup) {

  }
  editPhone(data: FormGroup) {

  }
  editRole(data: FormGroup) {

  }


  changepassword() { }
}
