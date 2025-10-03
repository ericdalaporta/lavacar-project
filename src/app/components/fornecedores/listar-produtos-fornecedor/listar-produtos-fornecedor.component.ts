import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProdutoService } from '../../../services/produto.service';
import { FornecedorService } from '../../../services/fornecedor.service';
import { Produto } from '../../../models/produto.model';

@Component({
  selector: 'app-listar-produtos-fornecedor',
  standalone: true,
  imports: [],
  templateUrl: './listar-produtos-fornecedor.component.html',
  styleUrl: './listar-produtos-fornecedor.component.css'
})
export class ListarProdutosFornecedorComponent implements OnInit {
  produtos: Produto[] = [];
  fornecedorId!: number;
  nomeFornecedor!: string;

  constructor(
    private route: ActivatedRoute,
    private produtoService: ProdutoService,
    private fornecedorService: FornecedorService
  ) {}

  async ngOnInit() {
    this.fornecedorId = Number(this.route.snapshot.paramMap.get('id'));
    await this.getProdutosByFornecedorId(this.fornecedorId);
    await this.getNomeFornecedorById(this.fornecedorId);
  }

  async getProdutosByFornecedorId(fornecedorId: number) {
    this.produtos = await this.produtoService.getProdutosByFornecedorId(fornecedorId);
  }

  async getNomeFornecedorById(fornecedorId: number) {
    const fornecedor = await this.fornecedorService.getFornecedorById(fornecedorId);
    this.nomeFornecedor = fornecedor?.nome ?? '';
  }
}