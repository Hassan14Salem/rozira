
import { User } from '../../Interfaces/user';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { AuthService } from 'src/app/Services/auth.service';
import { RolesService } from 'src/app/Services/roles.service';
import { UsersService } from 'src/app/Services/users.service';



export function matchPasswords(passwordControlName: string, rePasswordControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors |null => {
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

    return null ;
  };

}




@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [MessageService,ConfirmationService],
  encapsulation: ViewEncapsulation.None , // to customize on primeNg in the component not neccassry in main.style
})





export class UsersComponent implements OnInit {
  @ViewChild('dt') dataTable!: Table; // Reference to the DataTable

  users: User[] = [];
  Items: User[] = [];
  Item = {} as User;

  user = {} as User;
  roles:any[]=[];
  AddDialog:boolean=false;
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
    { field: 'email', header: 'tableHeader.email'  },
    { field: 'phoneNumber', header: 'tableHeader.phoneNum'  },
    { field: 'role', header: 'tableHeader.role'  },


  ];

  searchValue:string=''
  itemDialog:boolean = false;
  confirmDeleteDialog:boolean=false;
  submitted:boolean = false;
  selectedUser: User = { userId: '', userName: '', email: '', phoneNumber: '', password: '', role: '' };  // Empty user data
  modalVisible: boolean = false;
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
    private _FormBuilder:FormBuilder ,
    private _auth:AuthService , private _roles :RolesService,
  private _alert:ToastrService) { }


  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;
    return password === rePassword ? null : { mismatch: true };
  }

  ngOnInit(): void {
    this.fetchUsers();
    this. getAllRoles();

    this.regeisterNewUser = this._FormBuilder.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      rePassword: [null, [Validators.required]],
      phone: [null, [Validators.required]]
    }, { validator: this.passwordMatchValidator });
   
  }
  getAllRoles()
  {
    this._roles.getRoles().subscribe({
      next:(Respose) => {
        console.log(Respose)
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
        this.Items =response;
        console.log(this.users);
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
    console.log(this.userName);
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

  // Open modal and populate form with user data
  openModal(userId: string): void {
    this.isLoading = true;
    this._UserService.getUserById(userId).subscribe({
      next: (data: User) => {
        this.selectedUser = data;
        this.editUserForm.patchValue(data);  // Populate form with user data
        this.modalVisible = true;  // Show modal
        this.selectedUserName = data.userName;
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      },
      complete: () => this.isLoading = false
    });
  }

  // Close the modal
  closeModal(): void {
    this.modalVisible = false;
    this.selectedUser = { userId: '', userName: '', email: '', phoneNumber: '', password: '', role: '' };  // Reset selected user
    this.editUserForm.reset();  // Reset the form
  }

  // Submit form for editing user
  onSubmit(user:User): void {
    console.log('user to update',user);
    if (user) {
      const formValues = this.editUserForm.value;

      console.log('Submitting form with values:', formValues);

      this._UserService.editUser( user).subscribe({
        next: (Response) => {
          console.log(Response);
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
        console.log(response);
        this._alert.success('User Created Successfully');
        this.fetchUsers();
        this.AddDialog = false;
      },
      error: (myError) => {
        console.log(myError.error.message);
        this.serverError = true;
        console.log(this.serverError);
        this.errormessage = myError.error.message;
        this.isloading = false;
        this._alert.error('failed to Create User Successfully');

      }

    });
    console.log(data.value);
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





  editUser(ev :any)
  {
    this.itemDialog = true;
    this.user = {...ev}; 
      console.log('user before update',this.user)
  }
  deleteDialog(ev:any)
  {
    this.confirmDeleteDialog =true;
    this.user = {...ev};
  }

  openNew()
  {
    this.AddDialog=true;
  }
  hideDialog()
  {
    this.itemDialog = false;
    this.confirmDeleteDialog = false;
  }

  save(ev:User)
  {
    if(ev.userId)
    {
      this.onSubmit(ev)
    } 
  }

  deleteItem(user:User)
  {
    this.deleteUser(user.userId)
    this.hideDialog();
  }

  hasError(): boolean {
    const userNameErrors = this.regeisterNewUser.get('userName')?.errors;
    const emailErrors = this.regeisterNewUser.get('email')?.errors;
    const passwordErrors = this.regeisterNewUser.get('password')?.errors;
    const phoneNumberErrors = this.regeisterNewUser.get('phoneNumber')?.errors;
    const roleErrors = this.regeisterNewUser.get('role')?.errors;

    return (userNameErrors && this.regeisterNewUser.get('userName')?.touched) || 
           (emailErrors && this.regeisterNewUser.get('email')?.touched) || 
           (passwordErrors && this.regeisterNewUser.get('password')?.touched) || 
           (phoneNumberErrors && this.regeisterNewUser.get('phoneNumber')?.touched) || 
           (roleErrors && this.regeisterNewUser.get('role')?.touched) || 
           !!this.errormessage; // Include server-side errors
  }


  loadItems(event:any) {
    console.log('table event',event)
  }

 deleteDialogMessage(ev :any){}
 editItem(ev :any){
  this.user = {...ev}
  this.itemDialog = true
 }

}
