import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Funcionario } from '../../../models/funcionario.model';
import { FuncionarioService } from '../services/funcionario.service';
import { MensagensService } from '../../../shared/services/mensagens.service';

@Component({
  selector: 'app-listar-funcionarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './listar-funcionarios.component.html',
  styleUrl: './listar-funcionarios.component.css'
})
export class ListarFuncionariosComponent implements OnInit {
  funcionarios: Funcionario[] = [];
  funcionariosFiltrados: Funcionario[] = [];
  carregando = false;
  readonly fotoPadrao = 'assets/img/sem-foto.jpg';
  readonly filtro = new FormControl('');

  constructor(
    private readonly funcionarioService: FuncionarioService,
    private readonly mensagensService: MensagensService,
    private readonly roteador: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.filtro.valueChanges.subscribe(valor => this.aplicarFiltro(valor ?? ''));
    await this.carregarFuncionarios();
  }

  async carregarFuncionarios(): Promise<void> {
    this.carregando = true;
    try {
      this.funcionarios = await this.funcionarioService.obterTodos();
      this.aplicarFiltro(this.filtro.value ?? '');
    } catch (erro) {
      await this.mensagensService.exibirErro('Falha ao carregar', 'Não foi possível carregar os funcionários.');
      console.error('Erro ao carregar funcionários', erro);
    } finally {
      this.carregando = false;
    }
  }

  editarFuncionario(id?: number): void {
    if (!id) {
      return;
    }
    this.roteador.navigate(['/funcionarios/cadastro-funcionario', id]);
  }

  async removerFuncionario(id?: number): Promise<void> {
    if (!id) {
      return;
    }

    const confirmar = await this.mensagensService.confirmarExclusao('Deseja remover este funcionário?');
    if (!confirmar) {
      return;
    }

    try {
      await this.funcionarioService.remover(id);
      await this.mensagensService.exibirSucesso('Funcionário removido', 'O funcionário foi removido com sucesso.');
      await this.carregarFuncionarios();
    } catch (erro) {
      await this.mensagensService.exibirErro('Erro ao remover', 'Não foi possível remover o funcionário.');
      console.error('Erro ao remover funcionário', erro);
    }
  }

  trackById(index: number, funcionario: Funcionario): number | undefined {
    return funcionario.id;
  }

  private aplicarFiltro(termo: string): void {
    const texto = termo.toLowerCase().trim();
    if (!texto) {
      this.funcionariosFiltrados = [...this.funcionarios];
      return;
    }

    this.funcionariosFiltrados = this.funcionarios.filter(funcionario =>
      [funcionario.nome, funcionario.funcao, funcionario.email, funcionario.telefone]
        .filter(Boolean)
        .some(campo => campo!.toString().toLowerCase().includes(texto))
    );
  }
}
