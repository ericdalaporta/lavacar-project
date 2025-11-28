import { Injectable } from '@angular/core';
import { Table } from 'dexie';
import { DbService } from '../../services/db.service';

@Injectable({ providedIn: 'root' })
export class IndexedDbService {
  constructor(private readonly dbService: DbService) {}

  adicionar<T>(nomeDaStore: string, entidade: T): Promise<number> {
    return this.obterTabela<T>(nomeDaStore).add(entidade);
  }

  obterPorId<T>(nomeDaStore: string, id: number): Promise<T | undefined> {
    return this.obterTabela<T>(nomeDaStore).get(id);
  }

  obterTodos<T>(nomeDaStore: string): Promise<T[]> {
    return this.obterTabela<T>(nomeDaStore).toArray();
  }

  atualizar<T>(nomeDaStore: string, entidade: T): Promise<number> {
    return this.obterTabela<T>(nomeDaStore).put(entidade);
  }

  remover(nomeDaStore: string, id: number): Promise<void> {
    return this.obterTabela(nomeDaStore).delete(id);
  }

  atualizarLote<T>(nomeDaStore: string, entidades: T[]): Promise<void> {
    return this.obterTabela<T>(nomeDaStore).bulkPut(entidades).then(() => undefined);
  }

  private obterTabela<T>(nomeDaStore: string): Table<T, number> {
    return this.dbService.table(nomeDaStore) as Table<T, number>;
  }
}
