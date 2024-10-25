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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if(error instanceof HttpErrorResponse){
           // Check if the error status is 401 (Unauthorized)
        if (error.status === 401) {
          // Show an alert to the user
          this.toastr.error('Your session has expired. Please log in again.');
          
          // Optionally, redirect to the login page
          this.router.navigate(['/login']); // Change the route as per your app's routing
        }
        }
       
        
        // Rethrow the error so that it can be handled by other error handlers if needed
        return throwError(error);
      })
    );
  }
}
