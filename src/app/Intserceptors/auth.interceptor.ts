import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../Services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService,private auth:AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if(error instanceof HttpErrorResponse){
           // Check if the error status is 401 (Unauthorized)
        if (error.status === 401) {
          // Show an alert to the user
          this.toastr.error('Your session has expired. Please log in again.');
          this.auth.logout();
        }
        }
       
        
        // Rethrow the error so that it can be handled by other error handlers if needed
        return throwError(error);
      })
    );
  }
}
