import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Movimentacao } from '../models/movimentacoes';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrincipalService {
  private readonly url = `${environment.api}/principal`;
  constructor(private http: HttpClient) {}

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

  async alterarStatusMovimentacao(novoStatus: number, movimentacao: Movimentacao): Promise<any> {
    return this.http.post(`${this.url}/alterarStatus`, {novoStatus, movimentacao}).toPromise();
  }

  async deletarMovimentacao(movimentacao: Movimentacao): Promise<any> {
    return this.http.delete(`${this.url}/${movimentacao.id}`).toPromise();
  }
}
