import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const preventURLBackGuard: CanActivateFn = (route, state) => {
 // Inject the Router dependency
 const router = inject(Router);

 // Check if the user is authenticated
 const isAuthenticated = localStorage.getItem('RoziraToken') !== null;

 if (isAuthenticated && state.url === '/login') {
   // If user is authenticated and trying to access the login page, redirect them
   router.navigate(['/dashboard']);  // Redirect to the dashboard or home page
   return false;
 }
else return true;
};
