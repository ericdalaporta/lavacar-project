export class Servico {
  constructor(
    public nome: string = '',
    public descricao: string = '',
    public preco: number = 0,
    public ordem: number = 0,
    public id?: number
  ) {}
}