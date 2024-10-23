import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private otpURL = 'https://roseirae.runasp.net/api/Password/send-otp';
  private verifyURL = 'https://roseirae.runasp.net/api/Password/verify-otp';

  private reSetURL = 'https://roseirae.runasp.net/api/Password/reset-password';

  constructor(private httpClient: HttpClient) { }

  sendOtp(formGroup: FormGroup): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    const payload = formGroup.value; // Send the actual form values
    return this.httpClient.post<any>(this.otpURL, payload, { headers });
  }

  private getToken(): string {
    return localStorage.getItem('RoziraToken') || '';
  }


  verifyOtp(FormGroup: FormGroup): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    const payload = FormGroup.value; // Send the actual form values
    return this.httpClient.post<any>(this.verifyURL, payload, { headers });
  }


  resetPassword(FormGroup: FormGroup): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    const payload = FormGroup.value; // Send the actual form values
    return this.httpClient.post<any>(this.reSetURL, payload, { headers });
  }


}

