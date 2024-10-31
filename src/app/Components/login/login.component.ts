import { PasswordService } from '../../Services/password.service';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../Services/auth.service';
import { PermissionService } from 'src/app/Services/permission.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private _AuthService: AuthService, private _Router: Router, private _PasswordService: PasswordService,
    private _PermissionService: PermissionService
  ) { 
    
  }
  showRessetSuccessfullMeassage: boolean = false;
  isloading: boolean = false;
  modalVisible: boolean = false;
  errormessage: string = '';
  // create the object in the api 
  loginExistUser = new FormGroup({
    userName: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(25)]),
    password: new FormControl(null, [Validators.required])
  });



  loginUser(data: FormGroup) {
    this.isloading = true;
    this._AuthService.login(data.value).subscribe({
      next: (response) => {
        if (response.token) {
          localStorage.setItem('RoziraToken', response.token);
            const username = this._AuthService.decodeUserToken();
          if (username) {
            this._AuthService.getUserPermissionsByUsername(username).subscribe({
              next: (permissions) => {
                localStorage.setItem('userPermissions' , JSON.stringify(permissions));
                this._PermissionService.setPermissions(permissions);
                this._Router.navigate(['/dashboard']);
              },
              error: (err) => {
                console.error('Failed to fetch user permissions:', err);
              }
            });
          } else {
            this.errormessage = "Failed to retrieve username.";
            this.isloading = false;
          }
        } else {
          this.errormessage = "Invalid response from server, no token found.";
          this.isloading = false;
        }
      },
      error: (myError) => {
        this.errormessage = 'invalid username or password';
        this.isloading = false;
      },
      complete: () => {
        this.isloading = false;
      }
    });
  }

  navigateToRecoveryPage() {
    this._Router.navigate(['/password-recovery']);
  }

  openPasswordRecoveryModal() {
    this.modalVisible = true;
  }
  
  closeModal(): void {
    this.modalVisible = false;

  }
  navigateToForgrttPassword(){
    this._Router.navigate(['/forgettPassword']);
  }

  passwordStatusMessage: string = '';

  recoveryForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email])
  });

  openVerifyingModal: boolean = false;

  sendOtp() {
    if (this.recoveryForm.valid) {
      this._PasswordService.sendOtp(this.recoveryForm).subscribe({
        // here the status is 200
        next: (res) => {
          this.showAlertMessage('OTP sent to your email', 'success');
          this.passwordStatusMessage = res.message;
          this.VerificationForm.get('email')?.setValue(this.recoveryForm.get('email')?.value);
          this.openVerifyingModal = true;
          this.modalVisible = false;
        },
        error: (error) => {
          this.showAlertMessage('Can\'t find this emai , try agin', 'error');
          this.recoveryForm.reset();
          console.error(error);
          this.passwordStatusMessage = error.error.message;
        }
      });
    } else {
      this.passwordStatusMessage = 'Ckeck Email entering models';
    }
  }


  VerificationForm = new FormGroup({
    email: new FormControl(),
    otp: new FormControl(null, Validators.required)
  });


  otpStatusMessage: string = '';


  sendVerification() {
    if (this.VerificationForm.valid) {
      this._PasswordService.verifyOtp(this.VerificationForm).subscribe({
        // here the status is 200
        next: (res) => {
          this.verificationStatusMessage = res.message;
          this.showAlertMessage('Valid OTP change the password,', 'success');

          this.ResettPaswordFrom.get('email')?.setValue(this.recoveryForm.get('email')?.value);
          this.openResettPassword = true;
          this.openVerifyingModal = false;

        },
        error: (error) => {
          this.showAlertMessage('Please enter a correct OTP, try', 'error');
          this.verificationStatusMessage = error.error.message;
          this.otpStatusMessage = this.verificationStatusMessage;
        }
      });
    } else {
      this.verificationStatusMessage = 'Error Check verify OTP Model';
    }
  }

  verificationStatusMessage: string = '';

  closeVerifyModal() {
    this.openVerifyingModal = false;
  }

  openResettPassword: boolean = false;


  ResettPaswordFrom = new FormGroup({
    email: new FormControl(),
    newPassword: new FormControl(null, Validators.required),
    confirmPassword: new FormControl(null, Validators.required),

  });
  ResettPaswordNow() {
    if (this.ResettPaswordFrom.valid) {
      this._PasswordService.resetPassword(this.ResettPaswordFrom).subscribe({

        next: (res) => {
          this.showAlertMessage('Password changed Successfully,', 'success');
          this.verificationStatusMessage = res.message;
          this.openResettPassword = false;
          this.showRessetSuccessfullMeassage = true;


        },
        error: (error) => {
          console.error(error);
          this.showAlertMessage('Couldn\'t update password,', 'error');
          this.verificationStatusMessage = error.error.errorMessage;

        }
      });
    } else {
      this.verificationStatusMessage = 'Error Check Resset Model';
    }
  }


  closeResetPassword() {
    this.openResettPassword = false;
  }

  hasErrors(): boolean {
    const userNameErrors = this.loginExistUser.get('userName')?.errors;
    const passwordErrors = this.loginExistUser.get('password')?.errors;
    return (userNameErrors && this.loginExistUser.get('userName')?.touched) ||
      (passwordErrors && this.loginExistUser.get('password')?.touched) ||
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
