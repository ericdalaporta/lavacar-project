import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Produto } from '../../../models/produto.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { ProdutoService } from '../../../services/produto.service';
import { MensagensService } from '../../../shared/services/mensagens.service';

@Component({
  selector: 'app-listar-produtos-fornecedor',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './listar-produtos-fornecedor.component.html',
  styleUrl: './listar-produtos-fornecedor.component.css'
})
export class ListarProdutosFornecedorComponent implements OnInit {
  produtos: Produto[] = [];
  fornecedorId!: number;
  nomeFornecedor!: string;
  carregando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService,
    private fornecedorService: FornecedorService,
    private readonly mensagensService: MensagensService
  ) {}

  async ngOnInit() {
    this.fornecedorId = Number(this.route.snapshot.paramMap.get('id'));
    await this.getProdutosByFornecedorId(this.fornecedorId);
    await this.getNomeFornecedorById(this.fornecedorId);
  }

  async getProdutosByFornecedorId(fornecedorId: number) {
    this.carregando = true;
    try {
      this.produtos = await this.produtoService.getProdutosByFornecedorId(fornecedorId);
    } finally {
      this.carregando = false;
    }
  }

  async getNomeFornecedorById(fornecedorId: number) {
    const fornecedor = await this.fornecedorService.getFornecedorById(fornecedorId);
    this.nomeFornecedor = fornecedor?.nome ?? '';
  }

  async aoReordenar(evento: CdkDragDrop<Produto[]>): Promise<void> {
    moveItemInArray(this.produtos, evento.previousIndex, evento.currentIndex);

    try {
      const todosProdutos = await this.produtoService.obterTodosOrdenados();
      const posicoesSubset = todosProdutos
        .map((produto, indice) => ({ produto, indice }))
        .filter(({ produto }) => produto.fornecedorId === this.fornecedorId)
        .map(({ indice }) => indice);

      posicoesSubset.forEach((posicao, indice) => {
        todosProdutos[posicao] = this.produtos[indice];
      });

      todosProdutos.forEach((produto, indice) => {
        produto.ordem = indice + 1;
      });

      await this.produtoService.atualizarOrdem(todosProdutos);
      await this.mensagensService.exibirSucesso('Ordem atualizada', 'A nova ordem dos produtos do fornecedor foi salva.');
      await this.getProdutosByFornecedorId(this.fornecedorId);
    } catch (erro) {
      await this.mensagensService.exibirErro('Erro ao salvar ordem', 'Não foi possível atualizar a ordem dos produtos.');
      console.error('Erro ao atualizar ordem dos produtos do fornecedor', erro);
      await this.getProdutosByFornecedorId(this.fornecedorId);
    }
  }

  trackById(indice: number, produto: Produto): number | undefined {
    return produto.id;
  }

  voltar(): void {
    this.router.navigate(['/fornecedores/listar-fornecedores']);
  }
}