import { User } from './../models/user';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable, ErrorHandler } from '@angular/core';
import { throwError, Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, retry, tap, map } from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly url = `${environment.api}/auth`;

  private subjUser$: BehaviorSubject<any> = new BehaviorSubject(null);
  private subLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  cadastrarUsuario(user: User): Observable<any> {
    return this.http.post(this.url + '/cadastrar', user).pipe(
      tap((u) => {
        localStorage.setItem('token', u.token);
        this.subLoggedIn$.next(true);
        this.subjUser$.next(u.user);
      })
    );
  }

  logar(user: User): Observable<any> {
    return this.http.post(this.url + '/autenticar', user).pipe(
      tap((u) => {
        localStorage.setItem('token', u.token);
        this.subLoggedIn$.next(true);
        this.subjUser$.next(u.user);
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (token && !this.subLoggedIn$.value) {
      return this.checkTokenValidation();
    }
    return this.subLoggedIn$.asObservable();
  }

  checkTokenValidation(): Observable<boolean> {
    return this.http.get(this.url + '/user').pipe(
      tap((u: any) => {
        if (u) {
          localStorage.setItem('token', u.token);
          this.subLoggedIn$.next(true);
          this.subjUser$.next(u.user);
        }
      }),
      map(
        (u) => (u ? true : false),
        catchError((err) => {
          this.logout();
          return of(false);
        })
      )
    );
  }

  getUser(): Observable<User> {
    return this.subjUser$.asObservable();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.subLoggedIn$.next(false);
    this.subjUser$.next(null);
  }
}
