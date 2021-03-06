export class Movimentacao {
  readonly id: number;
  readonly tipo: number;
  readonly descricao: string;
  readonly valor: number;
  readonly data: Date;
  readonly usuarioId: number;

  constructor(
    id?: number,
    tipo?: number,
    descricao?: string,
    valor?: number,
    data?: Date,
    usuarioId?: number
  ) {
    this.id = id;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
    this.data = data;
    this.usuarioId = usuarioId;
  }
}
