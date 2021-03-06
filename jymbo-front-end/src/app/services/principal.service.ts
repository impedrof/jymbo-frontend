import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Movimentacao } from './../models/movimentacoes';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PrincipalService {
  private readonly url = 'http://localhost:3000/principal';
  constructor(private http: HttpClient) {}

  getMovimentacoes(idUsuario: number): Observable<Movimentacao[]> {
    return this.http.get(`${this.url}/${idUsuario}`).pipe(
      map((mov: any) => {
        if (!mov) {
          throw new Error('Erro ao buscar movimentações.');
        }
        return mov;
      })
    );
  }
}
