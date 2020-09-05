import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (localStorage.getItem('token')) {
      let token = localStorage.getItem('token');
      const authReq = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
        },
      });
      return next.handle(authReq).pipe(catchError((err) => this.errToken(err)));
    }
    return next.handle(req).pipe(catchError((err) => this.errToken(err)));
  }

  errToken(err) {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 401) {
        this.authService.logout();
        this.router.navigateByUrl('/login');
      }
    }
    return throwError(err);
  }
}
