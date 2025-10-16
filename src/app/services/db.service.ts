import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Cliente } from '../models/cliente.model';
import { Fornecedor } from '../models/fornecedor.model';
import { Funcionario } from '../models/funcionario.model';
import { ProdutoServico } from '../models/produto-servico.model';
import { Produto } from '../models/produto.model';
import { Servico } from '../models/servico.model';
@Injectable({ providedIn: 'root' })
export class DbService extends Dexie {
  fornecedores!: Table<Fornecedor, number>;
  produtos!: Table<Produto, number>;
  servicos!: Table<Servico, number>;
  produtosServico!: Table<ProdutoServico, [number, number]>;
  clientes!: Table<Cliente, number>;
  funcionarios!: Table<Funcionario, number>;
  constructor() {
    super('LavaCarDB');
    this.version(1).stores({
      fornecedores: '++id, nome, cnpj, fone',
      produtos: '++id, nome, preco, quantidade, fornecedorId',
      servicos: '++id, nome, descricao, preco',
      produtosServico: '[servicoId+produtoId], servicoId, produtoId, quantidade'
    });

    this.version(2).stores({
      fornecedores: '++id, nome, cnpj, fone',
      produtos: '++id, nome, preco, quantidade, fornecedorId',
      servicos: '++id, nome, descricao, preco, ordem',
      produtosServico: '[servicoId+produtoId], servicoId, produtoId, quantidade',
      clientes: '++id, nome, telefone, email, foto, endereco',
      funcionarios: '++id, nome, telefone, email, foto, funcao, dataAdmissao'
    });

    this.version(3).stores({
      fornecedores: '++id, nome, cnpj, fone',
      produtos: '++id, nome, preco, quantidade, fornecedorId',
      servicos: '++id, nome, descricao, preco, ordem',
      produtosServico: '[servicoId+produtoId], servicoId, produtoId, quantidade',
      clientes: '++id, nome, telefone, email, foto, endereco',
      funcionarios: '++id, nome, telefone, email, foto, funcao, dataAdmissao',
      agendamentos: '++id, clienteId, funcionarioId, servicoId, data, hora, status'
    });

    this.version(4)
      .stores({
        fornecedores: '++id, nome, cnpj, fone, ordem',
        produtos: '++id, nome, preco, quantidade, fornecedorId, ordem',
        servicos: '++id, nome, descricao, preco, ordem',
        produtosServico: '[servicoId+produtoId], servicoId, produtoId, quantidade',
        clientes: '++id, nome, telefone, email, foto, endereco',
        funcionarios: '++id, nome, telefone, email, foto, funcao, dataAdmissao',
        agendamentos: '++id, clienteId, funcionarioId, servicoId, data, hora, status, ordem'
      })
      .upgrade(async transacao => {
        const ajustarOrdem = async (nome: string) => {
          const tabela = transacao.table(nome) as Table<{ id?: number; ordem?: number }, number>;
          const registros = await tabela.toArray();
          await Promise.all(
            registros.map(async (registro, indice) => {
              if (registro.id === undefined) {
                return;
              }
              if (registro.ordem && registro.ordem > 0) {
                return;
              }
              await tabela.update(registro.id, { ordem: indice + 1 });
            })
          );
        };

        await ajustarOrdem('fornecedores');
        await ajustarOrdem('produtos');
        await ajustarOrdem('agendamentos');
      });
  }
}
