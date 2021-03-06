import { User } from './../../../models/user';
import { Movimentacao } from './../../../models/movimentacoes';
import { PrincipalService } from './../../../services/principal.service';
import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit {
  user: User;
  movimentacaoForm: FormGroup;
  listaDeMovimentacoes: Movimentacao[] = [];
  listaReceitas = [];
  listaDespesas = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private principal: PrincipalService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe((res) => {
      this.user = res;
      this.principal.getMovimentacoes(res.id).subscribe(mov => {
        this.listaDeMovimentacoes = mov;
      });
    });

    this.movimentacaoForm = this.formBuilder.group({
      tipo: [1, Validators.required],
      descricao: [null, Validators.required],
      valor: [null, Validators.required],
      data: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), Validators.required]
    })

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
      this.movimentacaoForm.patchValue({
        tipo: 1
      })
    } else {
      opcao2.classList.add('ativa');
      opcao1.classList.remove('ativa');
      this.movimentacaoForm.patchValue({
        tipo: 2
      })
    }
  }

  cadastrarMovimentacao(): any {
    const tipo = this.movimentacaoForm.value.tipo;
    const descricao = this.movimentacaoForm.value.descricao;
    const valor = this.movimentacaoForm.value.valor;
    const data = this.movimentacaoForm.value.data;

    if (!descricao) {
      this.movimentacaoForm.controls.descricao.setErrors({ required: true });
      this.movimentacaoForm.controls.descricao.markAsDirty();
    }

    if (!valor) {
      this.movimentacaoForm.controls.valor.setErrors({ required: true });
      this.movimentacaoForm.controls.valor.markAsDirty();
    }

    if (!data) {
      this.movimentacaoForm.controls.data.setErrors({ required: true });
      this.movimentacaoForm.controls.data.markAsDirty();
    }

    if (!this.movimentacaoForm.valid) {
      return -1;
    }

    this.principal.cadastrarMovimentacao(new Movimentacao(null, tipo, descricao, valor, data, this.user.id)).subscribe(response => {
      if(response) {
        this.principal.getMovimentacoes(this.user.id).subscribe(mov => {
          this.listaDeMovimentacoes = mov;
        });
      }
    });
  }

  getErrorMessage(group: FormGroup, formName: string): string {
    const formControl = group.controls[formName];
    if (formControl.hasError('required')) {
      return 'Campo obrigatório';
    }
  }

  checkErrorCamp(formGroup: FormGroup, name: string): boolean {
    const formControl = formGroup.controls[name];

    return formControl.invalid && formControl.dirty;
  }

  formatarData(data: Date): string {
    return `${data}`;
  }
}
