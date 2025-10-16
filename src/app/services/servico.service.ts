import { Injectable } from '@angular/core';
import { Servico } from '../models/servico.model';
import { DbService } from './db.service';

@Injectable({ providedIn: 'root' })
export class ServicoService {
  constructor(private readonly dbService: DbService) {}

  async add(servico: Servico): Promise<number> {
    servico.preco = Number(servico.preco ?? 0);
    if (!servico.ordem || servico.ordem <= 0) {
      servico.ordem = await this.obterProximaOrdem();
    }
    return this.dbService.servicos.add(servico);
  }

  async getAll(): Promise<Servico[]> {
    const servicos = await this.dbService.servicos.toArray();
    return servicos.map(servico => this.mapearServico(servico));
  }

  async obterTodosOrdenados(): Promise<Servico[]> {
    const servicos = await this.getAll();
    return servicos.sort((primeiro, segundo) => (primeiro.ordem ?? 0) - (segundo.ordem ?? 0));
  }

  async getById(id: number): Promise<Servico | undefined> {
    const servico = await this.dbService.servicos.get(id);
    return servico ? this.mapearServico(servico) : undefined;
  }

  async update(servico: Servico): Promise<number> {
    servico.preco = Number(servico.preco ?? 0);
    if (!servico.ordem || servico.ordem <= 0) {
      servico.ordem = await this.obterProximaOrdem();
    }
    return this.dbService.servicos.put(servico);
  }

  delete(id: number): Promise<void> {
    return this.dbService.servicos.delete(id);
  }

  atualizarOrdem(servicos: Servico[]): Promise<void> {
    return this.dbService.servicos.bulkPut(servicos).then(() => undefined);
  }

  private async obterProximaOrdem(): Promise<number> {
    const servicos = await this.dbService.servicos.toArray();
    const maiorOrdem = servicos.reduce((ordemAtual, servico) => {
      const ordemServico = servico.ordem ?? 0;
      return ordemServico > ordemAtual ? ordemServico : ordemAtual;
    }, 0);
    return maiorOrdem + 1;
  }

  private mapearServico(servico: Servico): Servico {
    return new Servico(
      servico.nome,
      servico.descricao,
      Number((servico as { preco?: number | string }).preco ?? 0),
      servico.ordem ?? 0,
      servico.id
    );
  }

  // Mantendo métodos antigos por compatibilidade (deprecated)
  /** @deprecated Use add() instead */
  addServico(servico: Servico): Promise<number> {
    return this.add(servico);
  }

  /** @deprecated Use getAll() instead */
  getAllServicos(): Promise<Servico[]> {
    return this.getAll();
  }

  /** @deprecated Use getById() instead */
  getServicoById(id: number): Promise<Servico | undefined> {
    return this.getById(id);
  }

  /** @deprecated Use update() instead */
  updateServico(servico: Servico): Promise<number> {
    return this.update(servico);
  }

  /** @deprecated Use delete() instead */
  deleteServico(id: number): Promise<void> {
    return this.delete(id);
  }
}