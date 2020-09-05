export class User {
  readonly nome: string;
  readonly email: string;
  readonly senha: string;
  readonly cpf: string;

  constructor(nome?, email?: string, senha?, cpf?) {
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.cpf = cpf;
  }
}
