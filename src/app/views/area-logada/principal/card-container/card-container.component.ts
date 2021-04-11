import { Movimentacao } from './../../../../models/movimentacoes';
import { Component, Input, OnInit, ChangeDetectionStrategy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {PrincipalService} from '../../../../services/principal.service';

@Component({
  selector: 'app-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // this line
})
export class CardContainerComponent implements OnInit, OnChanges {

  @Input() listaDeMovimentacoes: Movimentacao[];
  @Input() dataMovimentacao;

  @Output() statusEvento = new EventEmitter<any>();

  dataMovInterna = '';

  constructor(private api: PrincipalService) { }
  ngOnChanges(): void {
    this.dataMovInterna = this.dataMovimentacao;
  }

  ngOnInit(): void {
  }

  verificarPosicaoDropdownButton(index: number): void {
    const opcoes = document.querySelector<HTMLElement>('#lista-opcoes' + index);
    opcoes.classList.remove('limite-altura');
    const rect = opcoes.getBoundingClientRect();
    if (rect.bottom >= (window.innerHeight - 100)) {
      opcoes.classList.add('limite-altura');
    }
  }

  verificarData(data: Movimentacao): boolean {
    const resp = this.dataMovInterna !== data.dataFormatada;
    this.dataMovInterna = data.dataFormatada;
    return resp;
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

}
