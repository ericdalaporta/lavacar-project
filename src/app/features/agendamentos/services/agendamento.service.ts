import { Injectable } from '@angular/core';
import { IndexedDbService } from '../../../core/services/indexed-db.service';
import { Agendamento, StatusAgendamento } from '../../../models/agendamento.model';

@Injectable({ providedIn: 'root' })
export class AgendamentoService {
  private readonly nomeDaStore = 'agendamentos';

  constructor(private readonly indexedDbService: IndexedDbService) {}

  async adicionar(agendamento: Agendamento): Promise<number> {
    if (!agendamento.ordem || agendamento.ordem <= 0) {
      agendamento.ordem = await this.obterProximaOrdem();
    }
    return this.indexedDbService.adicionar<Agendamento>(this.nomeDaStore, agendamento);
  }

  async atualizar(agendamento: Agendamento): Promise<number> {
    if (!agendamento.ordem || agendamento.ordem <= 0) {
      agendamento.ordem = await this.obterProximaOrdem();
    }
    return this.indexedDbService.atualizar<Agendamento>(this.nomeDaStore, agendamento);
  }

  remover(id: number): Promise<void> {
    return this.indexedDbService.remover(this.nomeDaStore, id);
  }

  async obterTodos(): Promise<Agendamento[]> {
    const agendamentos = await this.indexedDbService.obterTodos<Agendamento>(this.nomeDaStore);
    const agendamentosMapeados = agendamentos
      .map(agendamento => this.mapearAgendamento(agendamento))
      .filter((agendamento): agendamento is Agendamento => Boolean(agendamento));

    return agendamentosMapeados.sort((primeiro, segundo) => (primeiro.ordem ?? 0) - (segundo.ordem ?? 0));
  }

  async obterPorId(id: number): Promise<Agendamento | undefined> {
    const agendamento = await this.indexedDbService.obterPorId<Agendamento>(this.nomeDaStore, id);
    return this.mapearAgendamento(agendamento);
  }

  atualizarOrdem(agendamentos: Agendamento[]): Promise<void> {
    return this.indexedDbService.atualizarLote<Agendamento>(this.nomeDaStore, agendamentos);
  }

  private mapearAgendamento(agendamento?: Agendamento): Agendamento | undefined {
    if (!agendamento) {
      return undefined;
    }

    return new Agendamento(
      agendamento.clienteId,
      agendamento.funcionarioId,
      agendamento.servicoId,
      agendamento.data,
      agendamento.hora,
      agendamento.status as StatusAgendamento,
      agendamento.observacoes,
      agendamento.id,
      agendamento.ordem ?? 0
    );
  }

  private async obterProximaOrdem(): Promise<number> {
    const agendamentos = await this.indexedDbService.obterTodos<Agendamento>(this.nomeDaStore);
    const maiorOrdem = agendamentos.reduce((ordemAtual, agendamentoAtual) => {
      const ordem = agendamentoAtual.ordem ?? 0;
      return ordem > ordemAtual ? ordem : ordemAtual;
    }, 0);
    return maiorOrdem + 1;
  }
}
