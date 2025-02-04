import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';

// El interceptor se debe definir como una función
export const TokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem('token');
  if (token) {
    // Clonamos la solicitud y agregamos el encabezado x-auth-token
    req = req.clone({
      setHeaders: { 'x-auth-token': token },
    });
  }
  return next(req); // Pasamos la solicitud al siguiente manejador
};
