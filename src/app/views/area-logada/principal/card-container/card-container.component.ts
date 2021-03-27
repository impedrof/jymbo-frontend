import { Movimentacao } from './../../../../models/movimentacoes';
import { Component, Input, OnInit, ChangeDetectionStrategy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // this line
})
export class CardContainerComponent implements OnInit, OnChanges {

  @Input() listaDeMovimentacoes;
  @Input() dataMovimentacao;

  dataMovInterna = '';

  constructor() { }
  ngOnChanges(): void {
    this.dataMovInterna = this.dataMovimentacao;
  }

  ngOnInit(): void {
  }

  verificarData(data: Movimentacao): boolean {
    const resp = this.dataMovInterna !== data.dataFormatada;
    this.dataMovInterna = data.dataFormatada;
    return resp;
  }

}
