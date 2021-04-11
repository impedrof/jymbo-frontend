import { Movimentacao } from './../../../../models/movimentacoes';
import { Component, Input, OnInit, ChangeDetectionStrategy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {PrincipalService} from '../../../../services/principal.service';

export interface ListaPorData {
  data: string;
  movimentacoes: Movimentacao[];
}

@Component({
  selector: 'app-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // this line
})
export class CardContainerComponent implements OnInit, OnChanges {

  @Input() listaDeMovimentacoes: Movimentacao[];

  @Output() statusEvento = new EventEmitter<any>();

  listaPorData: ListaPorData[] = [];

  constructor(private api: PrincipalService) { }
  ngOnChanges(): void {
    this.separarPorData();
  }

  ngOnInit(): void {
    this.separarPorData();
  }

  separarPorData(): void {
    const grupos = {};
    this.listaDeMovimentacoes.forEach(mov => {
      if (!grupos[mov.dataFormatada]) {
        grupos[mov.dataFormatada] = [];
      }
      grupos[mov.dataFormatada].push(mov);
    });

    this.listaPorData = Object.keys(grupos).map(datas => {
      const listaPorData: ListaPorData = {
        data: datas,
        movimentacoes: grupos[datas]
      };
      return listaPorData;
    });
  }

  verificarPosicaoDropdownButton(index: number): void {
    const opcoes = document.querySelector<HTMLElement>('#lista-opcoes' + index);
    opcoes.classList.remove('limite-altura');
    const rect = opcoes.getBoundingClientRect();
    if (rect.bottom >= (window.innerHeight - 100)) {
      opcoes.classList.add('limite-altura');
    }
  }

  async setarStatus(status: number, mov: Movimentacao, index: number): Promise<void> {
    const span = document.querySelector<HTMLElement>('#span' + index);
    const statusSend = status === 1.0 ? 0.0 : 1.0;
    const movRes = await this.api.alterarStatusMovimentacao(statusSend, mov);
    this.statusEvento.emit();
    if (span.classList.contains('ativo')) {
      span.classList.remove('ativo');
    } else {
      span.classList.add('ativo');
    }
  }

  async deletarMovimentacao(movimentacao: Movimentacao): Promise<void> {
    const resposta = await this.api.deletarMovimentacao(movimentacao);
    if (resposta) {
      this.statusEvento.emit();
    }
  }

}
