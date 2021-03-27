import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Movimentacao } from './../models/movimentacoes';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PrincipalService {
  private readonly url = 'http://localhost:3000/principal';
  constructor(private http: HttpClient) {}

  private criarHeaders(contentType: string): any {
    return { headers: new HttpHeaders({ 'Content-Type': contentType }), responseType: 'text'};
  }

  buscarMovimentacoesPorMes(idUsuario: number, data: Date): Observable<Movimentacao[]> {
    return this.http.get(`${this.url}/${idUsuario}/${data}`).pipe(
      map((mov: Movimentacao[]) => {
        if (!mov) {
          throw new Error('Erro ao buscar movimentações.');
        }
        return mov;
      })
    );
  }

  buscarTodasMovimentacoes(idUsuario: number): Observable<Movimentacao[]> {
    return this.http.get(`${this.url}/${idUsuario}`).pipe(
      map((mov: Movimentacao[]) => {
        if (!mov) {
          throw new Error('Erro ao buscar movimentações.');
        }
        return mov;
      })
    );
  }

  cadastrarMovimentacao(movimentacao: Movimentacao): Observable<any> {
    return this.http.post(`${this.url}/cadastrar`, movimentacao).pipe(
      tap((u) => {})
    );
  }
}
