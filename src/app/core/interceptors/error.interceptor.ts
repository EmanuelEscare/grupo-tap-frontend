import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

function extractMessage(error: HttpErrorResponse): string {
  const body = error.error as { message?: string; errors?: Record<string, string[]> } | null;

  if (body?.errors) {
    const firstField = Object.values(body.errors)[0];
    if (firstField?.length) {
      return firstField[0];
    }
  }

  if (body?.message) {
    return body.message;
  }

  if (error.status === 0) {
    return 'No se pudo conectar con el servidor.';
  }

  return 'Ocurrio un error inesperado. Intenta de nuevo.';
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        authService.clearSession();
        router.navigate(['/login']);
      }

      notificationService.error(extractMessage(error));

      return throwError(() => error);
    })
  );
};
