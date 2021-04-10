import { User } from '../../../models/user';
import { Movimentacao } from '../../../models/movimentacoes';
import { PrincipalService } from '../../../services/principal.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {DatePipe, formatDate} from '@angular/common';
import {ModalJymboComponent} from '../../shared/modal-jymbo/modal-jymbo.component';
import {ModalConfig} from '../../shared/modal-jymbo/modal-config';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit {
  @ViewChild('jyModal') private modalJymbo: ModalJymboComponent;
  @ViewChild('bodyModal') private bodyModal: TemplateRef<any>;

  modalConfig: ModalConfig = {
    modalTitle: 'Teste',
    cancelButtonLabel: 'Cancelar',
    confirmButtonLabel: 'Cadastrar'
  };

  user: User;
  movimentacaoForm: FormGroup;
  listaDeMovimentacoes: Movimentacao[] = [];

  totalValor = 0;
  totalReceita = 0;
  totalDespesa = 0;

  mesReceitas = 0;
  mesDespesas = 0;

  dataMovimentacao = '';
  dataAtual: Date;
  mesAtual = 'Atual';

  isMobile: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private principal: PrincipalService,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe((res) => {
      this.user = res;
      this.getDataAtual();
      this.buscarMovPorMes(res.id, this.dataAtual);
      this.buscarTodasMov(res.id);
    });
    this.movimentacaoForm = this.formBuilder.group({
      tipo: [1, Validators.required],
      descricao: [null, Validators.required],
      valor: [null, Validators.required],
      data: [this.mascaraDataAtual(), Validators.required]
    });
    this.isMobile = window.outerWidth <= 1000;
    window.onresize = () => {
      if (window.screen.width <= 1000) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
        this.modalJymbo.close();
      }
    };
  }

  mascaraDataAtual(): string {
    const atualData = new Date();
    const yyyy = atualData.getFullYear();
    const MM = atualData.getMonth() + 1;
    const dd = atualData.getDate();
    const hh = atualData.getHours();
    const mm = atualData.getMinutes();
    const ss = atualData.getSeconds();

    const stringData = `${yyyy}/${MM}/${dd} ${hh}:${mm}:${ss} GMT`;
    const novaData = new Date(stringData);
    return novaData.toISOString().substring(0, 19);
  }

  abrirModal(): void {
    this.modalJymbo.open();
    this.resetarFormulario();
  }

  fecharModal(): void {
    this.resetarFormulario();
  }

  mostrarOcutarDetalhes(): void {
    const containerPrincipal = document.querySelector<HTMLElement>('.container-principal');
    const painelCards = document.querySelector<HTMLElement>('.painel-cards');
    const descricao = document.querySelector<HTMLElement>('.mostrar-detalhes .descricao');
    const icone = document.querySelector<HTMLElement>('.mostrar-detalhes .material-icons');

    if (!containerPrincipal.classList.contains('detalhes')) {
      containerPrincipal.classList.add('detalhes');
      painelCards.classList.add('detalhes');
      descricao.innerHTML = 'Ocultar detalhes';
      icone.innerHTML = 'keyboard_arrow_up';
    } else {
      containerPrincipal.classList.remove('detalhes');
      painelCards.classList.remove('detalhes');
      descricao.innerHTML = 'Mostrar detalhes';
      icone.innerHTML = 'keyboard_arrow_down';
    }
  }

  async buscarTodasMov(idUsuario): Promise<void> {
    await this.principal.buscarTodasMovimentacoes(idUsuario).subscribe((mov: Movimentacao[]) => {
      const novaLista = Movimentacao.instanciarArrayMovimentacao(mov);
      this.resetarValorMovimentacoesTotais();
      this.totalReceita = novaLista.map((movi: Movimentacao) => movi?.tipo === 1 && movi?.status === 1 ? movi.valor : 0)
        .reduce((t, vA) => t + vA, 0);
      this.totalDespesa = novaLista.map((movim: Movimentacao) => movim?.tipo === 2 && movim?.status === 1 ? movim.valor : 0)
        .reduce((t, vA) => t + vA, 0);
      this.totalValor = this.totalReceita - this.totalDespesa;
    });
  }

  resetarValorMovimentacoesTotais(): void {
    this.totalValor = 0;
    this.totalReceita = 0;
    this.totalDespesa = 0;
  }

  async buscarMovPorMes(idUsuario, data): Promise<void> {
    await this.principal.buscarMovimentacoesPorMes(idUsuario, data).subscribe((mov: Movimentacao[]) => {
      this.listaDeMovimentacoes = Movimentacao.instanciarArrayMovimentacao(mov);
      this.resetarValorMovimentacoesMensais();
      this.mesReceitas = this.listaDeMovimentacoes.map(movi => movi?.tipo === 1 ? movi.valor : 0)
        .reduce((total, valorAtual) => total + valorAtual, 0);
      this.mesDespesas = this.listaDeMovimentacoes.map(movim => movim?.tipo === 2 ? movim.valor : 0)
        .reduce((total, valorAtual) => total + valorAtual, 0);
    });
  }

  resetarValorMovimentacoesMensais(): void {
    this.mesReceitas = 0;
    this.mesDespesas = 0;
  }

  alterarMes(tipo?: string , mov?: Movimentacao): void {
    if (tipo === '+') {
      const novoMes = this.dataAtual.getMonth() + 1;
      this.dataAtual.setMonth(novoMes);
    } else if (tipo === '-') {
      const novoMes = this.dataAtual.getMonth() - 1;
      this.dataAtual.setMonth(novoMes);
    } else if (mov) {
      const novaData = new Date(mov.data);
      const novoMes = novaData.getMonth();
      this.dataAtual.setMonth(novoMes);
    }

    this.buscarMovPorMes(this.user.id, this.dataAtual).then(res => {
      const mesExtenso = this.dataAtual.toLocaleDateString('default', { month: 'long' });
      const anoExtenso = this.dataAtual.toLocaleDateString('default', { year: '2-digit' });
      this.mesAtual = `${mesExtenso.charAt(0).toLocaleUpperCase() + mesExtenso.slice(1)} / ${anoExtenso}`;
      if (this.dataAtual.getMonth() === new Date().getMonth()) {
        this.mesAtual = 'Atual';
      }
      this.cd.detectChanges();
    });
    this.dataMovimentacao = '';

  }

  getDataAtual(): void {
    this.dataAtual = new Date();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  escolherTipoMovimentacao(tipo: number): void {
    const opcao1 = document.querySelector('#opcao1');
    const opcao2 = document.querySelector('#opcao2');
    if (tipo === 1) {
      opcao1.classList.add('ativa');
      opcao2.classList.remove('ativa');
      this.movimentacaoForm.patchValue({
        tipo: 1
      });
    } else {
      opcao2.classList.add('ativa');
      opcao1.classList.remove('ativa');
      this.movimentacaoForm.patchValue({
        tipo: 2
      });
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

    const novaMov = new Movimentacao(null, tipo, descricao, valor, data, this.user.id);
    this.principal.cadastrarMovimentacao(novaMov).subscribe(response => {
      if (response) {
        this.getDataAtual();
        this.buscarTodasMov(this.user.id);
        this.buscarMovPorMes(this.user.id, this.dataAtual).then(res => {
          this.alterarMes(null, novaMov);
          this.resetarFormulario();
          this.escolherTipoMovimentacao(1);
          this.modalJymbo.close();
        });
      }
    });
  }

  resetarFormulario(): void {
    this.movimentacaoForm = this.formBuilder.group({
      tipo: [1, Validators.required],
      descricao: [null, Validators.required],
      valor: [null, Validators.required],
      data: [this.mascaraDataAtual(), Validators.required]
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

  buscarMovimentacoes(): void {
    this.buscarTodasMov(this.user.id);
    this.buscarMovPorMes(this.user.id, this.dataAtual);
  }
}
