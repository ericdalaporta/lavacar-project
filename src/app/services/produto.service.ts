import { Injectable } from '@angular/core';
import { Produto } from '../models/produto.model';
import { DbService } from './db.service';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  constructor(private dbService: DbService) {}

  async add(produto: Produto): Promise<number> {
    if (!produto.ordem || produto.ordem <= 0) {
      produto.ordem = await this.obterProximaOrdem();
    }
    produto.preco = Number(produto.preco ?? 0);
    return this.dbService.produtos.add(produto);
  }

  async getAll(): Promise<Produto[]> {
    const produtos = await this.dbService.produtos.toArray();
    return produtos
      .map(produto => ({ ...produto, preco: Number(produto.preco ?? 0) }))
      .sort((primeiro, segundo) => (primeiro.ordem ?? 0) - (segundo.ordem ?? 0));
  }

  async getById(id: number): Promise<Produto | undefined> {
    const produto = await this.dbService.produtos.get(id);
    return produto ? { ...produto, preco: Number(produto.preco ?? 0) } : undefined;
  }

  async update(produto: Produto): Promise<number> {
    if (!produto.ordem || produto.ordem <= 0) {
      produto.ordem = await this.obterProximaOrdem();
    }
    produto.preco = Number(produto.preco ?? 0);
    return this.dbService.produtos.put(produto);
  }

  delete(id: number): Promise<void> {
    return this.dbService.produtos.delete(id);
  }

  async getByFornecedorId(fornecedorId: number): Promise<Produto[]> {
    const produtos = await this.dbService.produtos.where('fornecedorId').equals(fornecedorId).toArray();
    return produtos
      .map(produto => ({ ...produto, preco: Number(produto.preco ?? 0) }))
      .sort((primeiro, segundo) => (primeiro.ordem ?? 0) - (segundo.ordem ?? 0));
  }

  async obterTodosOrdenados(): Promise<Produto[]> {
    return this.getAll();
  }

  atualizarOrdem(produtos: Produto[]): Promise<void> {
    return this.dbService.produtos.bulkPut(produtos).then(() => undefined);
  }

  // Mantendo métodos antigos por compatibilidade (deprecated)
  /** @deprecated Use add() instead */
  addProduto(produto: Produto): Promise<number> {
    return this.add(produto);
  }

  /** @deprecated Use getAll() instead */
  getAllProdutos(): Promise<Produto[]> {
    return this.getAll();
  }

  /** @deprecated Use getById() instead */
  getProdutoById(id: number): Promise<Produto | undefined> {
    return this.getById(id);
  }

  /** @deprecated Use update() instead */
  updateProduto(produto: Produto): Promise<number> {
    return this.update(produto);
  }

  /** @deprecated Use delete() instead */
  deleteProduto(id: number): Promise<void> {
    return this.delete(id);
  }

  /** @deprecated Use getByFornecedorId() instead */
  getProdutosByFornecedorId(fornecedorId: number): Promise<Produto[]> {
    return this.getByFornecedorId(fornecedorId);
  }

  private async obterProximaOrdem(): Promise<number> {
    const produtos = await this.dbService.produtos.toArray();
    const maiorOrdem = produtos.reduce((ordemAtual, produto) => {
      const ordemProduto = produto.ordem ?? 0;
      return ordemProduto > ordemAtual ? ordemProduto : ordemAtual;
    }, 0);
    return maiorOrdem + 1;
  }
}