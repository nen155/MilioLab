import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from './auth.service';

/**
 * Añade el token de Sanctum a las peticiones a la API y cierra la sesión si la
 * API responde 401 (token caducado o revocado).
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  const isApi = request.url.includes('/api/');
  const isLogin = request.url.includes('/auth/login');

  const authorized =
    token && isApi && !isLogin
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request;

  return next(authorized).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && isApi && !isLogin) {
        auth.logout();
      }

      return throwError(() => error);
    }),
  );
};
