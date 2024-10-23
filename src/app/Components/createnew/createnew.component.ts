import { formatNumber } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, PatternValidator, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-createnew',
  templateUrl: './createnew.component.html',
  styleUrls: ['./createnew.component.css']
})
export class CreatenewComponent {
  constructor(private _AuthService: AuthService, private _Router: Router) { }

  isloading: boolean = false;
  errormessage: string = '';
  showErrorHandelling: boolean = false;
  serverError: boolean = false;
  // create the object in the api 
  regeisterNewUser = new FormGroup({
    userName: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(25)]),
    email: new FormControl(null, [Validators.required, Validators.email]),  
    password: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(25)]),
    phoneNumber: new FormControl(null, [Validators.required, Validators.pattern(/^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/)]),
    role: new FormControl(null, [Validators.required, Validators.pattern(/(Admin|User)/)])

  });


  createNewUser(data: FormGroup) {
    this.isloading = true;
    this.serverError = false;

    this._AuthService.register(data.value).subscribe({
      next: (response) => {
        console.log(response);
        this.showAlertMessage('User created succsessfully,', 'success');
        
        setTimeout(() => this._Router.navigate(['/users']), 1500);
        // here We can Put A popUp For The Wrrong message
      },
      error: (myError) => {
        console.log(myError.error.message);
        this.serverError = true;
        console.log(this.serverError);
        this.errormessage = myError.error.message;
        this.isloading = false;

      },
      complete: () => {
        this.isloading = false;
        this.serverError = true;

      },

    });
    console.log(data.value);
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
  alertMessage: string = '';
  alertType: string = ''; // Can be 'success', 'error', etc.
  showAlert: boolean = false;

  showAlertMessage(message: string, type: string): void {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => this.showAlert = false, 5000); // Hide alert after 5 seconds
  }

 

}
