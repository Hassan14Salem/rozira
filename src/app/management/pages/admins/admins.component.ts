import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/Services/auth.service';
import { RolesService } from 'src/app/Services/roles.service';
import { UsersService } from 'src/app/Services/users.service';
import { ManagementService } from '../services/management.service';
import { MessageService, ConfirmationService } from 'primeng/api';


export function matchPasswords(passwordControlName: string, rePasswordControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get(passwordControlName);
    const rePasswordControl = formGroup.get(rePasswordControlName);

    if (passwordControl && rePasswordControl) {
      // If both fields are filled and do not match
      if (rePasswordControl.value && rePasswordControl.value !== passwordControl.value) {
        rePasswordControl.setErrors({ noMatch: true }); // Set error
      } else {
        rePasswordControl.setErrors(null); // Clear error
      }
    }

    return null;
  };

}



@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css'],
  providers: [MessageService, ConfirmationService],
  encapsulation: ViewEncapsulation.None, 
})
export class AdminsComponent implements OnInit{

  @ViewChild('dt') dataTable!: Table; // Reference to the DataTable
  permissionsLoaded = false;
  permissions: string[] = [];
  users: User[] = [];
  Items: User[] = [];
  Item = {} as User;

  user = {} as User;
  roles: any[] = [];
  AddDialog: boolean = false;
  isloading: boolean = false;
  errormessage: string = '';
  showErrorHandelling: boolean = false;
  serverError: boolean = false;
  regeisterNewUser = new FormGroup({
    userName: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(25)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(25)]),
    rePassword: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(25)]),
    phoneNumber: new FormControl(null, [Validators.required, Validators.pattern(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/)]),
    role: new FormControl(null, [Validators.required, Validators.pattern(/(Admin|User)/)])

  });

  pageColumns = [
    { field: 'userName', header: 'tableHeader.username' },
    { field: 'email', header: 'tableHeader.email' },
    { field: 'phoneNumber', header: 'tableHeader.phoneNum' },
    { field: 'role', header: 'tableHeader.role' },


  ];

  searchValue: string = ''
  itemDialog: boolean = false;
  confirmDeleteDialog: boolean = false;
  submitted: boolean = false;
  selectedUser: User = { userId: '', userName: '', email: '', phoneNumber: '', password: '', role: '' };  // Empty user data
  modalVisible: boolean = false;

  // start of pagination 
  admins:User[]=[];
  userNamePagination:string ='';
  phoneNum:string='';
  email:string ='';
  PageNumber:number =1;
  pageSize:number = 10;

  getAdmins()
  {
    this.managementService.getAdmins(this.userNamePagination,this.phoneNum,this.email,this.PageNumber,this.pageSize).subscribe({
      next:(Response) =>{
        this.admins = Response.items
      }
    })
  }

  // end of pagination 


  // Track modal visibility
  isLoading: boolean = false;  // Track loading state for user actions (optional)

  // Form initialization with validation
  editUserForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/)]),
    role: new FormControl('', [Validators.required, Validators.pattern(/(Admin|User)/)])
  });

  selectedUserName: string = '';
  constructor(private _UserService: UsersService,
    private _AuthService :AuthService,
    private _FormBuilder: FormBuilder,
    private managementService:ManagementService,
    private _auth: AuthService, private _roles: RolesService,
    private _alert: ToastrService) { }


  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;
    return password === rePassword ? null : { mismatch: true };
  }
  


  

  
  // get all permissions by user



  ngOnInit(): void {
    this.loadPermissions();
    this.fetchUsers();
    this.getAllRoles();
    this.getAdmins()
  }
  getAllRoles() {
    this._roles.getRoles().subscribe({
      next: (Respose) => {
        this.roles = Respose;
      }
    })
  }
  // Fetch all users
  fetchUsers(): void {
    this.isLoading = true;
    this._UserService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response;
        this.Items = response;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
      complete: () => this.isLoading = false
    });
  }
  confrmDelete: boolean = false;
  OpenDelModal: boolean = false;
  // Delete user by ID


  userId: string = '';
  userName: string = '';
  sendIDAndUserName(userIdfromFront: string, userUsername: string): void {
    this.userId = userIdfromFront;
    this.userName = userUsername;
    this.OpenDelModal = true;
  }

  Confirm() {
    this.confrmDelete = true;
    this.deleteUser(this.userId);
  }

  deleteUser(userId: string): void {
    this._UserService.deleteUser(userId).subscribe({
      next: () => {
        this.removeUserFromList(userId);
        this._alert.success('user Deleted Successfully')
        this.fetchUsers();
      },
      error: (error) => {
        this._alert.success('Error deleting user')
      }
    });

  }
  Cancel() {
    this.OpenDelModal = false
  }

  // Remove the user from the UI after deletion
  removeUserFromList(userId: string): void {
    this.users = this.users.filter(user => user.userId !== userId);
  }



  // Submit form for editing user
  onSubmit(user: User): void {
    if (user) {
      const formValues = this.editUserForm.value;
      this._UserService.editUser(user).subscribe({
        next: (Response) => {
          this._alert.success('User updated successfully!')
          this.hideDialog();
          this.fetchUsers();
        },
        error: (error) => {
          this._alert.error('Faild to Update User')
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

  createNewUser(data: FormGroup) {
    this.isloading = true;
    this.serverError = false;
    this._auth.register(data.value).subscribe({
      next: (response) => {
        this._alert.success('User Created Successfully');
        this.fetchUsers();
        this.AddDialog = false;
      },
      error: (myError) => {
        this.serverError = true;
        this.errormessage = myError.error.message;
        this.isloading = false;
        this._alert.error('failed to Create User Successfully');

      }

    });
  }
  alertMessage: string = '';

  alertType: string = ''; // Can be 'success', 'error', etc.
  showAlert: boolean = false;

  showAlertMessage(message: string, type: string): void {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => this.showAlert = false, 3000); // Hide alert after 3 seconds
  }





  editUser(ev: any) {
    this.itemDialog = true;
    this.user = { ...ev };
  }



  

  openNew() {
    this.AddDialog = true;
  }
  hideDialog() {
    this.itemDialog = false;
    this.confirmDeleteDialog = false;
  }

  save(ev: User) {
    if (ev.userId) {
      this.onSubmit(ev)
    }
  }

  deleteItem(user: User) {
    this.confirmDeleteDialog = true
    this.deleteUser(user.userId)
    this.hideDialog();
  }



  loadItems(event:any)
  {
    const _pageNumber = event.first! / event.rows! + 1;

    const _pageSize = event.rows;
    this.PageNumber = _pageNumber;
    this.pageSize   =   _pageSize

    this.getAdmins()
  }
 

  getNameValue(value: any) {
    this.userNamePagination = value.target.value;
    
    if(this.userNamePagination != '') {
      this.getAdmins();

    } else
    {
      this.getAdmins();

    }
  }

  deleteDialogMessage(ev: any) {
    this.Item = {...ev}
    this.confirmDeleteDialog = true;
   }

  editItem(ev: any) {
    this.user = { ...ev }
    this.itemDialog = true
  }


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
        this.permissions = permissions;
        this.permissionsLoaded = true;
        localStorage.setItem('userPermissions', JSON.stringify(permissions));
      });
    }
  }

}
