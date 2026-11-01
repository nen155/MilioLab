import { HttpErrorResponse } from '@angular/common/http';

/** Mensaje legible de un error de la API (validación incluida). */
export function errorMessage(error: unknown, fallback = 'Ha ocurrido un error.'): string {
  if (error instanceof HttpErrorResponse) {
    const errors = error.error?.errors as Record<string, string[]> | undefined;

    if (errors) {
      return Object.values(errors).flat().join(' ');
    }

    if (typeof error.error?.message === 'string') {
      return error.error.message;
    }

    if (error.status === 0) {
      return 'No se pudo conectar con la API.';
    }
  }

  return fallback;
}
