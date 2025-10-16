import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { MensagensService } from '../../../shared/services/mensagens.service';

@Component({
  selector: 'app-listar-fornecedor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './listar-fornecedor.component.html',
  styleUrl: './listar-fornecedor.component.css'
})
export class ListarFornecedorComponent implements OnInit {
  fornecedores: Fornecedor[] = [];
  filtro = new FormControl('');
  fornecedoresFiltrados: Fornecedor[] = [];
  carregando = false;

  constructor(
    private fornecedorService: FornecedorService,
    private router: Router,
    private readonly mensagensService: MensagensService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.carregarFornecedores();
    this.filtro.valueChanges.subscribe(() => {
      this.aplicarFiltro();
    });
  }

  private async carregarFornecedores(): Promise<void> {
    this.carregando = true;
    try {
      this.fornecedores = await this.fornecedorService.obterTodosOrdenados();
      this.aplicarFiltro();
    } finally {
      this.carregando = false;
    }
  }

  private aplicarFiltro(): void {
    const termo = this.filtro.value?.toLowerCase().trim() ?? '';
    if (!termo) {
      this.fornecedoresFiltrados = [...this.fornecedores];
      return;
    }

    this.fornecedoresFiltrados = this.fornecedores.filter(fornecedor =>
      fornecedor.nome.toLowerCase().includes(termo) ||
      fornecedor.cnpj.toLowerCase().includes(termo) ||
      fornecedor.fone.toLowerCase().includes(termo)
    );
  }

  async aoReordenar(evento: CdkDragDrop<Fornecedor[]>): Promise<void> {
    const filtroAtivo = this.filtro.value?.trim();
    if (filtroAtivo) {
      await this.mensagensService.exibirInformacao('Filtre para visualizar', 'Limpe o campo de pesquisa para reordenar.');
      this.aplicarFiltro();
      return;
    }

    moveItemInArray(this.fornecedoresFiltrados, evento.previousIndex, evento.currentIndex);
    this.fornecedores = [...this.fornecedoresFiltrados];
    this.fornecedores.forEach((fornecedor, indice) => {
      fornecedor.ordem = indice + 1;
    });

    try {
      await this.fornecedorService.atualizarOrdem(this.fornecedores);
      await this.mensagensService.exibirSucesso('Ordem atualizada', 'A nova ordem dos fornecedores foi salva.');
    } catch (erro) {
      await this.mensagensService.exibirErro('Erro ao salvar ordem', 'Não foi possível atualizar a ordem dos fornecedores.');
      console.error('Erro ao atualizar ordem dos fornecedores', erro);
      await this.carregarFornecedores();
    }
  }

  editFornecedor(id: number) {
    this.router.navigate(['/fornecedores/editar-fornecedor', id]);
  }

  async deleteFornecedor(id: number): Promise<void> {
    const confirmar = await this.mensagensService.confirmarExclusao('Deseja remover este fornecedor?');
    if (!confirmar) {
      return;
    }

    try {
      await this.fornecedorService.deleteFornecedor(id);
      await this.mensagensService.exibirSucesso('Fornecedor removido', 'O fornecedor foi removido com sucesso.');
      await this.carregarFornecedores();
    } catch (erro) {
      await this.mensagensService.exibirErro('Erro ao remover', 'Não foi possível remover o fornecedor.');
      console.error('Erro ao remover fornecedor', erro);
    }
  }

  viewProdutosFornecedor(id: number) {
    this.router.navigate(['/fornecedor', id, 'produtos']);
  }

  trackById(index: number, item: Fornecedor) {
    return item.id;
  }
}