import { Injectable } from '@angular/core';
import { Fornecedor } from '../models/fornecedor.model';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  constructor(private dbService: DbService) {}

  async add(fornecedor: Fornecedor): Promise<number> {
    if (!fornecedor.ordem || fornecedor.ordem <= 0) {
      fornecedor.ordem = await this.obterProximaOrdem();
    }
    return this.dbService.fornecedores.add(fornecedor);
  }

  async getAll(): Promise<Fornecedor[]> {
    const fornecedores = await this.dbService.fornecedores.toArray();
    return fornecedores.sort((primeiro, segundo) => (primeiro.ordem ?? 0) - (segundo.ordem ?? 0));
  }

  getById(id: number): Promise<Fornecedor | undefined> {
    return this.dbService.fornecedores.get(id);
  }

  async update(fornecedor: Fornecedor): Promise<number> {
    if (!fornecedor.ordem || fornecedor.ordem <= 0) {
      fornecedor.ordem = await this.obterProximaOrdem();
    }
    return this.dbService.fornecedores.put(fornecedor);
  }

  delete(id: number): Promise<void> {
    return this.dbService.fornecedores.delete(id);
  }

  async obterTodosOrdenados(): Promise<Fornecedor[]> {
    return this.getAll();
  }

  atualizarOrdem(fornecedores: Fornecedor[]): Promise<void> {
    return this.dbService.fornecedores.bulkPut(fornecedores).then(() => undefined);
  }

  // Mantendo métodos antigos por compatibilidade (deprecated)
  /** @deprecated Use add() instead */
  addFornecedor(fornecedor: Fornecedor): Promise<number> {
    return this.add(fornecedor);
  }

  /** @deprecated Use getAll() instead */
  getAllFornecedores(): Promise<Fornecedor[]> {
    return this.getAll();
  }

  /** @deprecated Use getById() instead */
  getFornecedorById(id: number): Promise<Fornecedor | undefined> {
    return this.getById(id);
  }

  /** @deprecated Use update() instead */
  updateFornecedor(fornecedor: Fornecedor): Promise<number> {
    return this.update(fornecedor);
  }

  /** @deprecated Use delete() instead */
  deleteFornecedor(id: number): Promise<void> {
    return this.delete(id);
  }

  private async obterProximaOrdem(): Promise<number> {
    const fornecedores = await this.dbService.fornecedores.toArray();
    const maiorOrdem = fornecedores.reduce((ordemAtual, fornecedor) => {
      const ordemFornecedor = fornecedor.ordem ?? 0;
      return ordemFornecedor > ordemAtual ? ordemFornecedor : ordemAtual;
    }, 0);
    return maiorOrdem + 1;
  }
}

