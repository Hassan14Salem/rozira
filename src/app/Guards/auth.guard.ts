import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
 // Instantiate the Router

  if (state.url.includes('/password-recovery')) {
    return true;

  }

  if (localStorage.getItem('RoziraToken') !== null) {
    return true;
  }

  else {
    router.navigate(['/login']);
    return false;
  }

};
