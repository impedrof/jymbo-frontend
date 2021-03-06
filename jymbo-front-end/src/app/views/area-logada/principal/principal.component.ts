import { Movimentacao } from './../../../models/movimentacoes';
import { PrincipalService } from './../../../services/principal.service';
import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { style } from '@angular/animations';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit {
  user;
  movimentacaoForm = new FormGroup({
    tipo: new FormControl(''),
    descricao: new FormControl(''),
    valor: new FormControl(''),
    data: new FormControl('')
  });
  listaDeMovimentacoes: Movimentacao[] = [];
  listaReceitas = [];
  listaDespesas = [];

  constructor(private authService: AuthService, private router: Router, private principal: PrincipalService) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe((res) => {
      this.user = res;
      this.principal.getMovimentacoes(res.id).subscribe(mov => {
        this.listaDeMovimentacoes = mov;
      });
    });

    window.onresize = () => {
      if(window.screen.width <= 1000) {
        this.logicaHideShow('hide');
      } else {
        this.logicaHideShow('show');
      }
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  addDespesaReceita() {
    const novaMovimentacao = this.movimentacaoForm.value;
    if (
      novaMovimentacao.tipo === '' ||
      novaMovimentacao.descricao === '' ||
      novaMovimentacao.valor === ''
    ) {
      return -1;
    }

    if (novaMovimentacao.tipo === '1') {
      this.listaReceitas.push(novaMovimentacao);
    } else {
      this.listaDespesas.push(novaMovimentacao);
    }
    this.listaDeMovimentacoes.push(novaMovimentacao);
    this.movimentacaoForm.reset();
  }

  logicaHideShow(tipo: string) {
    const divEsquerdo = document.querySelector('.body-principal .esquerdo');
    if (tipo === 'hide') {
      divEsquerdo.classList.remove('show');
      divEsquerdo.classList.add('hide');
    } else if (tipo === 'show') {
      divEsquerdo.classList.add('show');
      divEsquerdo.classList.remove('hide');
    }
  }

  showHideAddMov(): void {
    const divEsquerdo = document.querySelector('.body-principal .esquerdo');
    if(divEsquerdo.classList.contains('show')) {
      this.logicaHideShow('hide');
    } else {
      this.logicaHideShow('show');
    }
  }

  escolherTipoMovimentacao(tipo: number): void {
    const opcao1 = document.querySelector("#opcao1");
    const opcao2 = document.querySelector("#opcao2");
    if(tipo === 1) {
      opcao1.classList.add('ativa');
      opcao2.classList.remove('ativa');
    } else {
      opcao2.classList.add('ativa');
      opcao1.classList.remove('ativa');
    }
  }
}
