import { Injectable } from '@angular/core';
import { IndexedDbService } from '../../../core/services/indexed-db.service';
import { Cliente } from '../../../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private readonly nomeDaStore = 'clientes';

  constructor(private readonly indexedDbService: IndexedDbService) {}

  adicionar(cliente: Cliente): Promise<number> {
    return this.indexedDbService.adicionar<Cliente>(this.nomeDaStore, cliente);
  }

  async obterPorId(id: number): Promise<Cliente | undefined> {
    const cliente = await this.indexedDbService.obterPorId<Cliente>(this.nomeDaStore, id);
    return this.mapearCliente(cliente);
  }

  async obterTodos(): Promise<Cliente[]> {
    const clientes = await this.indexedDbService.obterTodos<Cliente>(this.nomeDaStore);
    return clientes
      .map(cliente => this.mapearCliente(cliente))
      .filter((clienteMapeado): clienteMapeado is Cliente => Boolean(clienteMapeado));
  }

  atualizar(cliente: Cliente): Promise<number> {
    return this.indexedDbService.atualizar<Cliente>(this.nomeDaStore, cliente);
  }

  remover(id: number): Promise<void> {
    return this.indexedDbService.remover(this.nomeDaStore, id);
  }

  private mapearCliente(cliente?: Cliente): Cliente | undefined {
    if (!cliente) {
      return undefined;
    }

    return new Cliente(
      cliente.endereco,
      cliente.nome,
      cliente.telefone,
      cliente.email,
      cliente.foto,
      cliente.id
    );
  }
}
