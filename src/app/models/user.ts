export class User {
  readonly id: number;
  readonly nome: string;
  readonly email: string;
  readonly senha: string;
  readonly cpf: string;

  constructor(
    id?: number,
    nome?: string,
    email?: string,
    senha?: string,
    cpf?: string) {
      this.id = id;
      this.nome = nome;
      this.email = email;
      this.senha = senha;
      this.cpf = cpf;
  }
}
