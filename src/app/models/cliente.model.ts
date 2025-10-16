import { Pessoa } from './pessoa.model';

export class Cliente extends Pessoa {
  constructor(
    public endereco: string = '',
    nome: string = '',
    telefone: string = '',
    email: string = '',
    foto: string = '',
    id?: number
  ) {
    super(nome, telefone, email, foto, id);
  }
}
