import { Injectable } from '@angular/core';
import { Produto } from '../models/produto.model';
import { DbService } from './db.service';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  deleteProduto(id: number) {
    throw new Error('Method not implemented.');
  }
  constructor(private dbService: DbService) { }

  addProduto(produto: Produto) {
    return this.dbService .produtos.add(produto);
  }

  getAllProdutos(): Promise<Produto[]> {
    return this.dbService.produtos.toArray();
  }
}