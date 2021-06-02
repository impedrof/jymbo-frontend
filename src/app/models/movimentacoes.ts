export class Movimentacao {
  readonly id: number;
  readonly tipo: number;
  readonly descricao: string;
  readonly valor: number;
  readonly data: Date;
  readonly usuarioId: number;
  readonly dataFormatada: string;
  readonly status: number;

  constructor(
    id?: number,
    tipo?: number,
    descricao?: string,
    valor?: number,
    data?: Date,
    usuarioId?: number,
    status?: number
  ) {
    this.id = id;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
    this.data = new Date(data);
    this.dataFormatada = this.formatarData(data);
    this.usuarioId = usuarioId;
    this.status = status;
  }

  static instanciarArrayMovimentacao(array: Movimentacao[]): Movimentacao[] {
    const novoArray: Movimentacao[] = [];
    array.forEach(item => {
      novoArray.push(new Movimentacao(item.id, item.tipo, item.descricao, item.valor, item.data, item.usuarioId, item.status));
    });
    return this.ordernarArrayMovimentacaoPorData(novoArray);
  }

  static ordernarArrayMovimentacaoPorData(array: Movimentacao[]): any {
    return array.sort((a, b) => {
      if (a.data > b.data) { return 1; }
      if (a.data < b. data) { return -1; }
    });
  }

  formatarData(data: Date): string {
    const dataConvertida = new Date(String(data).replace('T00:00:00.000Z', ''));
    let dd = dataConvertida.toLocaleString('default', { day: '2-digit'});
    const mm = dataConvertida.toLocaleString('default', { month: 'long' });
    const yyyy = dataConvertida.getFullYear();
    if (dd.length < 2) {
      dd = `0${dd}`;
    }
    return `${dd} de ${mm} de ${yyyy}`;
  }
}
