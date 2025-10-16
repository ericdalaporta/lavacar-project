export class Pessoa {
  constructor(
    public nome: string = '',
    public telefone: string = '',
    public email: string = '',
    public foto: string = '',
    public id?: number
  ) {}
}
