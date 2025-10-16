import { Pessoa } from './pessoa.model';

export class Funcionario extends Pessoa {
  constructor(
    public funcao: string = '',
    public dataAdmissao: Date | null = null,
    nome: string = '',
    telefone: string = '',
    email: string = '',
    foto: string = '',
    id?: number
  ) {
    super(nome, telefone, email, foto, id);
  }
}
