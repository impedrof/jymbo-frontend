import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';
import { User } from './../../models/user';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user: User;

  loginForm: any;
  cadastroForm: any;

  cadastroOpen = false;
  hasErrorLogin: string;
  hasErrorRegister: string;

  constructor(
    private authService: AuthService,
    private route: Router,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: [null, Validators.required],
      senha: [null, Validators.required],
    });

    this.cadastroForm = this.formBuilder.group(
      {
        nome: [null, Validators.required],
        email: [
          null,
          Validators.compose([Validators.required, Validators.email]),
        ],
        senha: [null, Validators.required],
        conSenha: [null, Validators.required],
        cpf: [null, Validators.required],
      },
      { validators: this.checkPasswords }
    );
  }

  ngOnInit(): void {
    this.hasErrorLogin = null;
    this.hasErrorRegister = null;
    this.authService.isAuthenticated().subscribe((res) => {
      if (res) {
        this.route.navigateByUrl('/principal');
      }
    });
  }

  abrirCadastro() {
    this.cadastroOpen = true;
  }

  fecharCadastro() {
    this.cadastroOpen = false;
  }

  cadastrarUsuario() {
    const nome = this.cadastroForm.value.nome;
    const email = this.cadastroForm.value.email;
    const senha = this.cadastroForm.value.senha;
    const conSenha = this.cadastroForm.value.conSenha;
    const cpf = this.cadastroForm.value.cpf;

    // TODO Refatorar essa verificação para evitar repetição de código
    if (!nome) {
      this.cadastroForm.controls.nome.setErrors({ required: true });
      this.cadastroForm.controls.nome.markAsDirty();
    }
    if (!email) {
      this.cadastroForm.controls.email.setErrors({ required: true });
      this.cadastroForm.controls.email.markAsDirty();
    }
    if (!senha) {
      this.cadastroForm.controls.senha.setErrors({ required: true });
      this.cadastroForm.controls.senha.markAsDirty();
    }
    if (!conSenha) {
      this.cadastroForm.controls.conSenha.setErrors({ required: true });
      this.cadastroForm.controls.conSenha.markAsDirty();
    }
    if (!cpf) {
      this.cadastroForm.controls.cpf.setErrors({ required: true });
      this.cadastroForm.controls.cpf.markAsDirty();
    }
    if (!this.cadastroForm.valid) {
      return;
    }

    this.authService
      .cadastrarUsuario(new User(nome, email, senha, cpf))
      .subscribe(
        (result) => {
          if (result) {
            this.route.navigateByUrl('/principal');
          }
        },
        (err) => {
          this.hasErrorRegister = err.error.error;
        }
      );
  }

  checkPasswords(group: FormGroup) {
    const senha = group.get('senha');
    const conSenha = group.get('conSenha');

    if (senha.dirty && senha.touched && conSenha.dirty && conSenha.touched) {
      return senha.value === conSenha.value ? null : { notSame: true };
    }
  }

  logarUsuario() {
    const email = this.loginForm.value.email;
    const senha = this.loginForm.value.senha;
    if (!this.loginForm.valid) return;
    this.authService.logar(new User(null, email, senha)).subscribe(
      (res) => {
        this.route.navigateByUrl('/principal');
      },
      (err) => {
        this.hasErrorLogin = err.error.error;
      }
    );
  }

  getErrorMessage(group: FormGroup, formName: string) {
    const formControl = group.controls[formName];
    if (formControl.hasError('required')) {
      return 'Campo obrigatório';
    }

    if (formControl.hasError('email')) {
      return 'Email inválido';
    }
    if (group.hasError('notSame')) {
      return 'As senhas não correspondem';
    }
  }

  checkErrorCamp(formGroup: FormGroup, name: string): boolean {
    return formGroup.controls[name].invalid && formGroup.controls[name].dirty;
  }
}
