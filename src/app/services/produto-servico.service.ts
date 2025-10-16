import { Injectable } from '@angular/core';
import { ProdutoServico } from '../models/produto-servico.model';
import { DbService } from './db.service';

@Injectable({ providedIn: 'root' })
export class ProdutoServicoService {
  constructor(private dbService: DbService) {}

  add(produtoServico: ProdutoServico): Promise<[number, number]> {
    return this.dbService.produtosServico.add(produtoServico);
  }

  getAll(): Promise<ProdutoServico[]> {
    return this.dbService.produtosServico.toArray();
  }

  getByServicoId(servicoId: number): Promise<ProdutoServico[]> {
    return this.dbService.produtosServico.where('servicoId').equals(servicoId).toArray();
  }

  getByProdutoId(produtoId: number): Promise<ProdutoServico[]> {
    return this.dbService.produtosServico.where('produtoId').equals(produtoId).toArray();
  }

  async substituirProdutosDoServico(servicoId: number, produtosIds: number[]): Promise<void> {
    await this.removerPorServico(servicoId);
    if (!produtosIds.length) {
      return;
    }

    const registros: ProdutoServico[] = produtosIds.map(produtoId => ({
      servicoId,
      produtoId,
      quantidade: 1
    }));

    await this.dbService.produtosServico.bulkPut(registros);
  }

  removerPorServico(servicoId: number): Promise<void> {
    return this.dbService.produtosServico.where('servicoId').equals(servicoId).delete().then(() => undefined);
  }

  delete(servicoId: number, produtoId: number): Promise<void> {
    return this.dbService.produtosServico.delete([servicoId, produtoId]);
  }

  // Mantendo métodos antigos por compatibilidade (deprecated)
  /** @deprecated Use getAll() instead */
  getAllProdutosServicos(): Promise<ProdutoServico[]> {
    return this.getAll();
  }
}