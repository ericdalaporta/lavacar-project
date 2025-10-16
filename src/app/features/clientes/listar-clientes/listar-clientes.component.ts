import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../services/cliente.service';
import { MensagensService } from '../../../shared/services/mensagens.service';

@Component({
  selector: 'app-listar-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './listar-clientes.component.html',
  styleUrl: './listar-clientes.component.css'
})
export class ListarClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  carregando = false;
  readonly fotoPadrao = 'assets/img/sem-foto.jpg';
  readonly filtro = new FormControl('');

  constructor(
    private readonly clienteService: ClienteService,
    private readonly mensagensService: MensagensService,
    private readonly roteador: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.filtro.valueChanges.subscribe(valor => this.aplicarFiltro(valor ?? ''));
    await this.carregarClientes();
  }

  async carregarClientes(): Promise<void> {
    this.carregando = true;
    try {
      this.clientes = await this.clienteService.obterTodos();
      this.aplicarFiltro(this.filtro.value ?? '');
    } catch (erro) {
      await this.mensagensService.exibirErro('Falha ao carregar', 'Não foi possível carregar os clientes.');
      console.error('Erro ao carregar clientes', erro);
    } finally {
      this.carregando = false;
    }
  }

  editarCliente(id?: number): void {
    if (!id) {
      return;
    }
    this.roteador.navigate(['/clientes/cadastro-cliente', id]);
  }

  async removerCliente(id?: number): Promise<void> {
    if (!id) {
      return;
    }

    const confirmar = await this.mensagensService.confirmarExclusao('Deseja realmente remover este cliente?');
    if (!confirmar) {
      return;
    }

    try {
      await this.clienteService.remover(id);
      await this.mensagensService.exibirSucesso('Cliente removido', 'O cliente foi removido com sucesso.');
      await this.carregarClientes();
    } catch (erro) {
      await this.mensagensService.exibirErro('Erro ao remover', 'Não foi possível remover o cliente.');
      console.error('Erro ao remover cliente', erro);
    }
  }

  trackById(index: number, cliente: Cliente): number | undefined {
    return cliente.id;
  }

  private aplicarFiltro(termo: string): void {
    const texto = termo.toLowerCase().trim();
    if (!texto) {
      this.clientesFiltrados = [...this.clientes];
      return;
    }

    this.clientesFiltrados = this.clientes.filter(cliente =>
      [cliente.nome, cliente.email, cliente.telefone, cliente.endereco]
        .filter(Boolean)
        .some(campo => campo!.toString().toLowerCase().includes(texto))
    );
  }
}
