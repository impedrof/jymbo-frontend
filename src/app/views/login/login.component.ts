import {
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
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
        conSenha: [null, Validators.required]
      },
      { validators: this.checkPasswords, updateOn: 'blur' }
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

  abrirCadastro(): void {
    this.cadastroOpen = true;
  }

  fecharCadastro(): void {
    this.cadastroOpen = false;
  }

  cadastrarUsuario(): any {
    const nome = this.cadastroForm.value.nome;
    const email = this.cadastroForm.value.email;
    const senha = this.cadastroForm.value.senha;
    const conSenha = this.cadastroForm.value.conSenha;

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
    if (!this.cadastroForm.valid) {
      return;
    }

    this.authService
      .cadastrarUsuario(new User(null, nome, email, senha))
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

  checkPasswords(group: FormGroup): any {
    const senha = group.get('senha');
    const conSenha = group.get('conSenha');

    if (senha.dirty && senha.touched && conSenha.dirty && conSenha.touched) {
      return senha.value === conSenha.value ? null : { notSame: true };
    }
  }

  logarUsuario(): void {
    const email = this.loginForm.value.email;
    const senha = this.loginForm.value.senha;
    if (!this.loginForm.valid) { return; }
    this.authService.logar(new User(null, null, email, senha)).subscribe(
      (res) => {
        this.route.navigateByUrl('/principal');
      },
      (err) => {
        this.hasErrorLogin = err.error.error;
      }
    );
  }

  getErrorMessage(group: FormGroup, formName: string): string {
    const formControl = group.controls[formName];
    if (formControl.hasError('required')) {
      return 'Campo obrigatório';
    }

    if (formControl.hasError('email')) {
      return 'Email inválido';
    }

    if (formControl.hasError('cpfInvalid')) {
      return 'Cpf Inválido';
    }

    if (group.hasError('notSame')) {
      return 'As senhas não correspondem';
    }
  }

  checkErrorCamp(formGroup: FormGroup, name: string): boolean {
    const formControl = formGroup.controls[name];

    return formControl.invalid && formControl.dirty;
  }
}
