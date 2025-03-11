import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../../token-entry/data-access/token.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();
  const body = req.body as { query?: string };

  // Exclude validateToken requests, there might be a better way to isolate this request
  if (body?.query && body.query.includes('viewer')) {
    return next(req);
  }
  // Clone the request and add the Authorization header
  const authReq = req.clone({
    setHeaders: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  return next(authReq);
};
