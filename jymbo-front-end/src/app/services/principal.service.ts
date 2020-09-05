import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PrincipalService {
  private readonly url = 'http://localhost:3000/principal';
  constructor(private http: HttpClient) {}

  getPrincipal() {
    return this.http.get(this.url);
  }
}
