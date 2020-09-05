import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

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
  });
  listaDeMovimentacoes = [];
  listaReceitas = [];
  listaDespesas = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe((res) => {
      this.user = res;
    });
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
}
