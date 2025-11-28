import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { Funcionario } from '../../../models/funcionario.model';
import { Servico } from '../../../models/servico.model';
import { Agendamento, StatusAgendamento } from '../../../models/agendamento.model';
import { AgendamentoService } from '../services/agendamento.service';
import { ClienteService } from '../../clientes/services/cliente.service';
import { FuncionarioService } from '../../funcionarios/services/funcionario.service';
import { ServicoService } from '../../../services/servico.service';
import { MensagensService } from '../../../shared/services/mensagens.service';

@Component({
  selector: 'app-cadastro-agendamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-agendamento.component.html',
  styleUrl: './cadastro-agendamento.component.css'
})
export class CadastroAgendamentoComponent implements OnInit {
  tituloPagina = 'Cadastrar Agendamento';
  agendamentoId?: number;

  clientes: Cliente[] = [];
  funcionarios: Funcionario[] = [];
  servicos: Servico[] = [];

  readonly statusAgendamento: StatusAgendamento[] = ['Pendente', 'Confirmado', 'Concluído', 'Cancelado'];

  formAgendamento = new FormGroup({
    clienteId: new FormControl<number | null>(null, [Validators.required]),
    funcionarioId: new FormControl<number | null>(null, [Validators.required]),
    servicoId: new FormControl<number | null>(null, [Validators.required]),
    data: new FormControl('', [Validators.required]),
    hora: new FormControl('', [Validators.required]),
    status: new FormControl<StatusAgendamento>('Pendente', [Validators.required]),
    observacoes: new FormControl('')
  });

  constructor(
    private readonly agendamentoService: AgendamentoService,
    private readonly clienteService: ClienteService,
    private readonly funcionarioService: FuncionarioService,
    private readonly servicoService: ServicoService,
    private readonly mensagensService: MensagensService,
    private readonly rotaAtiva: ActivatedRoute,
    private readonly roteador: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.carregarDadosAuxiliares();
    const idParam = this.rotaAtiva.snapshot.paramMap.get('id');
    if (idParam) {
      this.agendamentoId = Number(idParam);
      this.tituloPagina = 'Editar Agendamento';
      await this.carregarAgendamento(this.agendamentoId);
    }
  }

  async salvarAgendamento(): Promise<void> {
    if (this.formAgendamento.invalid) {
      this.formAgendamento.markAllAsTouched();
      return;
    }

    const agendamento = this.construirAgendamento();

    try {
      if (this.agendamentoId) {
        await this.agendamentoService.atualizar(agendamento);
        await this.mensagensService.exibirSucesso('Agendamento atualizado', 'Os dados do agendamento foram atualizados.');
      } else {
        await this.agendamentoService.adicionar(agendamento);
        await this.mensagensService.exibirSucesso('Agendamento cadastrado', 'O agendamento foi cadastrado com sucesso.');
      }

      this.formAgendamento.reset({ status: 'Pendente' });
      this.roteador.navigate(['/agendamentos/listar-agendamentos']);
    } catch (erro) {
      await this.mensagensService.exibirErro('Operação não concluída', 'Não foi possível salvar o agendamento.');
      console.error('Erro ao salvar agendamento', erro);
    }
  }

  private async carregarDadosAuxiliares(): Promise<void> {
    try {
      const [clientes, funcionarios, servicos] = await Promise.all([
        this.clienteService.obterTodos(),
        this.funcionarioService.obterTodos(),
        this.servicoService.obterTodosOrdenados()
      ]);
      this.clientes = clientes;
      this.funcionarios = funcionarios;
      this.servicos = servicos;
    } catch (erro) {
      await this.mensagensService.exibirErro('Falha ao carregar dados', 'Não foi possível carregar os dados auxiliares.');
      console.error('Erro ao carregar dados auxiliares', erro);
    }
  }

  private async carregarAgendamento(id: number): Promise<void> {
    try {
      const agendamento = await this.agendamentoService.obterPorId(id);
      if (!agendamento) {
        return;
      }

      this.formAgendamento.patchValue({
        clienteId: agendamento.clienteId,
        funcionarioId: agendamento.funcionarioId,
        servicoId: agendamento.servicoId,
        data: agendamento.data,
        hora: agendamento.hora,
        status: agendamento.status,
        observacoes: agendamento.observacoes
      });
    } catch (erro) {
      await this.mensagensService.exibirErro('Falha ao carregar', 'Não foi possível carregar o agendamento.');
      console.error('Erro ao carregar agendamento', erro);
    }
  }

  private construirAgendamento(): Agendamento {
    const valores = this.formAgendamento.value;
    return new Agendamento(
      Number(valores.clienteId),
      Number(valores.funcionarioId),
      Number(valores.servicoId),
      valores.data ?? '',
      valores.hora ?? '',
      (valores.status ?? 'Pendente') as StatusAgendamento,
      valores.observacoes ?? '',
      this.agendamentoId
    );
  }

  obterControle(nomeControle: keyof typeof this.formAgendamento.controls) {
    return this.formAgendamento.get(nomeControle);
  }

  limparFormulario(): void {
    this.formAgendamento.reset({ status: 'Pendente' });
  }
}
