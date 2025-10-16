import { Injectable } from '@angular/core';
import { IndexedDbService } from '../../../core/services/indexed-db.service';
import { Funcionario } from '../../../models/funcionario.model';

@Injectable({ providedIn: 'root' })
export class FuncionarioService {
  private readonly nomeDaStore = 'funcionarios';

  constructor(private readonly indexedDbService: IndexedDbService) {}

  adicionar(funcionario: Funcionario): Promise<number> {
    return this.indexedDbService.adicionar<Funcionario>(this.nomeDaStore, funcionario);
  }

  async obterPorId(id: number): Promise<Funcionario | undefined> {
    const funcionario = await this.indexedDbService.obterPorId<Funcionario>(this.nomeDaStore, id);
    return this.mapearFuncionario(funcionario);
  }

  async obterTodos(): Promise<Funcionario[]> {
    const funcionarios = await this.indexedDbService.obterTodos<Funcionario>(this.nomeDaStore);
    return funcionarios
      .map(funcionario => this.mapearFuncionario(funcionario))
      .filter((funcionarioMapeado): funcionarioMapeado is Funcionario => Boolean(funcionarioMapeado));
  }

  atualizar(funcionario: Funcionario): Promise<number> {
    return this.indexedDbService.atualizar<Funcionario>(this.nomeDaStore, funcionario);
  }

  remover(id: number): Promise<void> {
    return this.indexedDbService.remover(this.nomeDaStore, id);
  }

  private mapearFuncionario(funcionario?: Funcionario): Funcionario | undefined {
    if (!funcionario) {
      return undefined;
    }

    const dataAdmissao = funcionario.dataAdmissao ? new Date(funcionario.dataAdmissao) : null;

    return new Funcionario(
      funcionario.funcao,
      dataAdmissao,
      funcionario.nome,
      funcionario.telefone,
      funcionario.email,
      funcionario.foto,
      funcionario.id
    );
  }
}
