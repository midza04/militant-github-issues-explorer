import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../../features/token-entry/data-access/token.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (tokenService.getToken()) {
    return true;
  } else {
    router.navigate(['/']).then();
    return false;
  }
};
