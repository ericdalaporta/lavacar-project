import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../../services/produto.service';
import { Produto } from '../../../models/produto.model';
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro-produto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro-produto.component.html',
  styleUrls: ['./cadastro-produto.component.css']
})
export class CadastroProdutoComponent implements OnInit {
  formProduto = new FormGroup({
    nome: new FormControl('', Validators.required),
    preco: new FormControl('', [Validators.required, Validators.min(0)]),
    quantidade: new FormControl('', [Validators.required, Validators.min(1)]),
    fornecedorId: new FormControl('', Validators.required)
  });

  fornecedores: Fornecedor[] = [];

  constructor(
    private produtoService: ProdutoService,
    private fornecedorService: FornecedorService
  ) {}

  async ngOnInit() {
    this.fornecedores = await this.fornecedorService.getAllFornecedores();
  }

  addProduto() {
    if (this.formProduto.invalid) {
      this.formProduto.markAllAsTouched();
      return;
    }
    const novoProduto: Produto = {
      nome: this.formProduto.value.nome!,
      preco: Number(this.formProduto.value.preco!),
      quantidade: Number(this.formProduto.value.quantidade!),
      fornecedorId: Number(this.formProduto.value.fornecedorId!)
    };
    this.produtoService.addProduto(novoProduto).then(() => {
      Swal.fire('Cadastro realizado!', 'O produto foi cadastrado com sucesso.', 'success');
      this.formProduto.reset();
    });
  }
}