import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // Instantiate the Router

  if (localStorage.getItem('RoziraToken') !== null) {
    return true;
  } else if (state.url.startsWith('/forgetPassword')) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }


};
