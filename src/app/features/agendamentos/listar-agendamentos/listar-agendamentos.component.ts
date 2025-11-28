import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Agendamento, StatusAgendamento } from '../../../models/agendamento.model';
import { Cliente } from '../../../models/cliente.model';
import { Funcionario } from '../../../models/funcionario.model';
import { Servico } from '../../../models/servico.model';
import { AgendamentoService } from '../services/agendamento.service';
import { ClienteService } from '../../clientes/services/cliente.service';
import { FuncionarioService } from '../../funcionarios/services/funcionario.service';
import { ServicoService } from '../../../services/servico.service';
import { MensagensService } from '../../../shared/services/mensagens.service';

interface AgendamentoComDetalhes extends Agendamento {
  clienteNome: string;
  funcionarioNome: string;
  servicoNome: string;
}

@Component({
  selector: 'app-listar-agendamentos',
  standalone: true,
  imports: [CommonModule, DragDropModule, ReactiveFormsModule],
  templateUrl: './listar-agendamentos.component.html',
  styleUrl: './listar-agendamentos.component.css'
})
export class ListarAgendamentosComponent implements OnInit {
  agendamentos: AgendamentoComDetalhes[] = [];
  agendamentosFiltrados: AgendamentoComDetalhes[] = [];
  carregando = false;
  readonly filtro = new FormControl('');
  agendamentoSelecionado: AgendamentoComDetalhes | null = null;

  constructor(
    private readonly agendamentoService: AgendamentoService,
    private readonly clienteService: ClienteService,
    private readonly funcionarioService: FuncionarioService,
    private readonly servicoService: ServicoService,
    private readonly mensagensService: MensagensService,
    private readonly roteador: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.filtro.valueChanges.subscribe(valor => this.aplicarFiltro(valor ?? ''));
    await this.carregarAgendamentos();
  }

  async carregarAgendamentos(): Promise<void> {
    this.carregando = true;
    try {
      const [agendamentos, clientes, funcionarios, servicos] = await Promise.all([
        this.agendamentoService.obterTodos(),
        this.clienteService.obterTodos(),
        this.funcionarioService.obterTodos(),
        this.servicoService.obterTodosOrdenados()
      ]);

      this.agendamentos = agendamentos.map(agendamento => ({
        ...agendamento,
        clienteNome: this.buscarNomePorId(clientes, agendamento.clienteId),
        funcionarioNome: this.buscarNomePorId(funcionarios, agendamento.funcionarioId),
        servicoNome: this.buscarNomePorId(servicos, agendamento.servicoId)
      }));
      this.aplicarFiltro(this.filtro.value ?? '');
    } catch (erro) {
      await this.mensagensService.exibirErro('Falha ao carregar', 'Não foi possível carregar os agendamentos.');
      console.error('Erro ao carregar agendamentos', erro);
    } finally {
      this.carregando = false;
    }
  }

  mostrarDetalhes(agendamento: AgendamentoComDetalhes): void {
    this.agendamentoSelecionado = agendamento;
  }

  fecharDetalhes(): void {
    this.agendamentoSelecionado = null;
  }

  @HostListener('document:keydown.escape')
  aoPressionarEsc(): void {
    if (this.agendamentoSelecionado) {
      this.fecharDetalhes();
    }
  }

  async aoReordenar(evento: CdkDragDrop<AgendamentoComDetalhes[]>): Promise<void> {
    const termoAtivo = this.filtro.value?.trim();
    if (termoAtivo) {
      await this.mensagensService.exibirInformacao('Limpe o filtro', 'Remova o texto da pesquisa para reordenar os agendamentos.');
      this.aplicarFiltro(termoAtivo);
      return;
    }

    moveItemInArray(this.agendamentosFiltrados, evento.previousIndex, evento.currentIndex);
    this.agendamentos = [...this.agendamentosFiltrados];
    this.agendamentos.forEach((agendamento, indice) => {
      agendamento.ordem = indice + 1;
    });

    try {
      const agendamentosParaAtualizar = this.agendamentos.map(
        agendamento =>
          new Agendamento(
            agendamento.clienteId,
            agendamento.funcionarioId,
            agendamento.servicoId,
            agendamento.data,
            agendamento.hora,
            agendamento.status,
            agendamento.observacoes,
            agendamento.id,
            agendamento.ordem
          )
      );

      await this.agendamentoService.atualizarOrdem(agendamentosParaAtualizar);
      await this.mensagensService.exibirSucesso('Ordem atualizada', 'A nova ordem dos agendamentos foi salva.');
    } catch (erro) {
      await this.mensagensService.exibirErro('Erro ao salvar ordem', 'Não foi possível atualizar a ordem dos agendamentos.');
      console.error('Erro ao atualizar ordem dos agendamentos', erro);
      await this.carregarAgendamentos();
    }
  }

  editarAgendamento(id?: number): void {
    if (!id) {
      return;
    }
    this.roteador.navigate(['/agendamentos/cadastro-agendamento', id]);
  }

  async removerAgendamento(id?: number): Promise<void> {
    if (!id) {
      return;
    }

    const confirmar = await this.mensagensService.confirmarExclusao('Deseja remover este agendamento?');
    if (!confirmar) {
      return;
    }

    try {
      await this.agendamentoService.remover(id);
      await this.mensagensService.exibirSucesso('Agendamento removido', 'O agendamento foi removido com sucesso.');
      await this.carregarAgendamentos();
    } catch (erro) {
      await this.mensagensService.exibirErro('Erro ao remover', 'Não foi possível remover o agendamento.');
      console.error('Erro ao remover agendamento', erro);
    }
  }

  aplicarFiltro(termo: string): void {
    const termoNormalizado = termo.toLowerCase().trim();
    if (!termoNormalizado) {
      this.agendamentosFiltrados = [...this.agendamentos];
      return;
    }

    this.agendamentosFiltrados = this.agendamentos.filter(agendamento =>
      [
        agendamento.clienteNome,
        agendamento.funcionarioNome,
        agendamento.servicoNome,
        agendamento.status,
        agendamento.data,
        agendamento.hora
      ]
        .filter(Boolean)
        .some(campo => campo!.toString().toLowerCase().includes(termoNormalizado))
    );
  }

  trackById(index: number, agendamento: AgendamentoComDetalhes): number | undefined {
    return agendamento.id;
  }

  private buscarNomePorId(registros: Array<Cliente | Funcionario | Servico>, id: number): string {
    return registros.find(registro => registro.id === id)?.nome ?? 'Não informado';
  }

  obterClasseStatus(status: StatusAgendamento): string {
    switch (status) {
      case 'Confirmado':
        return 'status-confirmado';
      case 'Concluído':
        return 'status-concluido';
      case 'Cancelado':
        return 'status-cancelado';
      default:
        return 'status-pendente';
    }
  }
}
