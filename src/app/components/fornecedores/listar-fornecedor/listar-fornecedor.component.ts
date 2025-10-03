import { Component, OnInit } from '@angular/core';
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listar-fornecedor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './listar-fornecedor.component.html',
  styleUrls: ['./listar-fornecedor.component.css']
})
export class ListarFornecedorComponent implements OnInit {
  fornecedores: Fornecedor[] = [];
  filtro = new FormControl('');
  fornecedoresFiltrados: Fornecedor[] = [];
  fornecedoresPaginados: Fornecedor[] = [];
  paginaAtual = 1;
  itensPorPagina = 3;
  Math = Math; // Permite usar Math.ceil no template

  constructor(
    private fornecedorService: FornecedorService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getAllFornecedores();
    this.filtro.valueChanges.subscribe(() => {
      this.atualizarFiltradosEPaginados();
    });
  }

  getAllFornecedores() {
    this.fornecedorService.getAllFornecedores().then(fornecedores => {
      this.fornecedores = fornecedores;
      this.atualizarFiltradosEPaginados();
    });
  }

  atualizarFiltradosEPaginados() {
    const filtro = this.filtro.value?.toLowerCase() || '';
    this.fornecedoresFiltrados = this.fornecedores.filter(fornecedor =>
      fornecedor.nome.toLowerCase().includes(filtro) ||
      fornecedor.cnpj.toLowerCase().includes(filtro) ||
      fornecedor.fone.toLowerCase().includes(filtro)
    );
    this.paginaAtual = 1; // Sempre volta para a primeira página ao filtrar
    this.atualizarPaginados();
  }

  atualizarPaginados() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.fornecedoresPaginados = this.fornecedoresFiltrados.slice(inicio, fim);
  }

  mudarPagina(pagina: number) {
    this.paginaAtual = pagina;
    this.atualizarPaginados();
  }

  anterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarPaginados();
    }
  }

  proxima() {
    if (this.paginaAtual < this.totalPages) {
      this.paginaAtual++;
      this.atualizarPaginados();
    }
  }

  irParaPagina(pagina: number) {
    this.paginaAtual = pagina;
    this.atualizarPaginados();
  }

  get totalPages(): number {
    return Math.ceil(this.fornecedoresFiltrados.length / this.itensPorPagina);
  }

  get paginasArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  editFornecedor(id: number) {
    this.router.navigate(['/fornecedores/editar-fornecedor', id]);
  }

  deleteFornecedor(id: number) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.fornecedorService.deleteFornecedor(id).then(() => {
          this.getAllFornecedores();
          Swal.fire('Excluído!', 'O fornecedor foi excluído com sucesso.', 'success');
        });
      }
    });
  }

  viewProdutosFornecedor(id: number) {
    this.router.navigate(['/fornecedor', id, 'produtos']);
  }

  trackById(index: number, item: Fornecedor) {
    return item.id;
  }
}