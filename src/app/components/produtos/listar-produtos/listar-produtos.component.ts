import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Produto } from '../../../models/produto.model';
import { MensagensService } from '../../../shared/services/mensagens.service';
import { FornecedorService } from '../../../services/fornecedor.service';
import { ProdutoService } from '../../../services/produto.service';

@Component({
  selector: 'app-listar-produtos',
  standalone: true,
  imports: [CommonModule, DragDropModule, ReactiveFormsModule],
  templateUrl: './listar-produtos.component.html',
  styleUrl: './listar-produtos.component.css'
})
export class ListarProdutosComponent implements OnInit {
  produtos: ProdutoComFornecedor[] = [];
  produtosFiltrados: ProdutoComFornecedor[] = [];
  carregando = false;
  readonly filtro = new FormControl('');

  constructor(
    private produtoService: ProdutoService,
    private fornecedorService: FornecedorService,
    private router: Router,
    private readonly mensagensService: MensagensService
  ) {}

  async ngOnInit(): Promise<void> {
    this.filtro.valueChanges.subscribe(valor => this.aplicarFiltro(valor ?? ''));
    await this.carregarProdutos();
  }

  async aoReordenar(evento: CdkDragDrop<ProdutoComFornecedor[]>): Promise<void> {
    const filtroAtivo = this.filtro.value?.trim();
    if (filtroAtivo) {
      await this.mensagensService.exibirInformacao('Limpe o filtro', 'Remova o texto da pesquisa para reordenar os produtos.');
      this.aplicarFiltro(filtroAtivo);
      return;
    }

    moveItemInArray(this.produtosFiltrados, evento.previousIndex, evento.currentIndex);
    this.produtos = [...this.produtosFiltrados];
    this.produtos.forEach((produto, indice) => {
      produto.ordem = indice + 1;
    });

    try {
      const produtosParaSalvar = this.produtos.map(({ fornecedorNome, ...dados }) => dados);
      await this.produtoService.atualizarOrdem(produtosParaSalvar);
      await this.mensagensService.exibirSucesso('Ordem atualizada', 'A nova ordem dos produtos foi salva.');
    } catch (erro) {
      await this.mensagensService.exibirErro('Erro ao salvar ordem', 'Não foi possível atualizar a ordem dos produtos.');
      console.error('Erro ao atualizar ordem dos produtos', erro);
      await this.carregarProdutos();
    }
  }

  editProduto(id: number) {
    // Redireciona para a tela de edição do produto
    this.router.navigate(['/produtos/cadastro-produto'], { queryParams: { id } });
  }

  async deleteProduto(id: number): Promise<void> {
    const confirmar = await this.mensagensService.confirmarExclusao('Deseja remover este produto?');
    if (!confirmar) {
      return;
    }

    try {
      await this.produtoService.deleteProduto(id);
      await this.mensagensService.exibirSucesso('Produto removido', 'O produto foi removido com sucesso.');
      await this.carregarProdutos();
    } catch (erro) {
      await this.mensagensService.exibirErro('Erro ao remover', 'Não foi possível remover o produto.');
      console.error('Erro ao remover produto', erro);
    }
  }

  trackById(indice: number, produto: Produto): number | undefined {
    return produto.id;
  }

  private async carregarProdutos(): Promise<void> {
    this.carregando = true;
    try {
      const [produtos, fornecedores] = await Promise.all([
        this.produtoService.obterTodosOrdenados(),
        this.fornecedorService.obterTodosOrdenados()
      ]);

      const mapaFornecedores = new Map<number, string>();
      fornecedores.forEach(fornecedor => {
        if (fornecedor.id !== undefined) {
          mapaFornecedores.set(fornecedor.id, fornecedor.nome);
        }
      });

      this.produtos = produtos.map(produto => ({
        ...produto,
        fornecedorNome: mapaFornecedores.get(produto.fornecedorId) ?? '—'
      }));
      this.aplicarFiltro(this.filtro.value ?? '');
    } finally {
      this.carregando = false;
    }
  }

  private aplicarFiltro(termo: string): void {
    const termoNormalizado = termo.toLowerCase().trim();
    if (!termoNormalizado) {
      this.produtosFiltrados = [...this.produtos];
      return;
    }

    this.produtosFiltrados = this.produtos.filter(produto =>
      [produto.nome, produto.fornecedorNome]
        .filter(Boolean)
        .some(campo => campo!.toLowerCase().includes(termoNormalizado))
    );
  }
}

interface ProdutoComFornecedor extends Produto {
  fornecedorNome: string;
}