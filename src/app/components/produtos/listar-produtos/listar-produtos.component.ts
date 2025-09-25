import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../../../services/produto.service';
import { FornecedorService } from '../../../services/fornecedor.service';
import { Produto } from '../../../models/produto.model';
import { Fornecedor } from '../../../models/fornecedor.model';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-produtos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-produtos.component.html',
  styleUrls: ['./listar-produtos.component.css']
})
export class ListarProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  fornecedoresMap: { [id: number]: string } = {};

  constructor(
    private produtoService: ProdutoService,
    private fornecedorService: FornecedorService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.produtos = await this.produtoService.getAllProdutos();
    const fornecedores = await this.fornecedorService.getAllFornecedores();
    fornecedores.forEach(f => this.fornecedoresMap[f.id!] = f.nome);
  }

  getFornecedorNome(id: number): string {
    return this.fornecedoresMap[id] || '';
  }

  editProduto(id: number) {
    // Redireciona para a tela de edição do produto
    this.router.navigate(['/produtos/cadastro-produto'], { queryParams: { id } });
  }

  async deleteProduto(id: number) {
    const confirm = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente excluir este produto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      await this.produtoService.deleteProduto(id);
      this.produtos = await this.produtoService.getAllProdutos();
      Swal.fire('Excluído!', 'Produto removido com sucesso.', 'success');
    }
  }
}