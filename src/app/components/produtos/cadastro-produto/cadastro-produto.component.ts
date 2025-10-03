import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../../services/produto.service';
import { Produto } from '../../../models/produto.model';
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  produtoId: number | null = null;

  constructor(
    private produtoService: ProdutoService,
    private fornecedorService: FornecedorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.fornecedores = await this.fornecedorService.getAllFornecedores();
    const id = this.route.snapshot.queryParams['id'];
    if (id) {
      this.produtoId = Number(id);
      const produto = await this.produtoService.getProdutoById(this.produtoId);
      if (produto) {
        this.formProduto.patchValue({
          nome: produto.nome,
          preco: produto.preco.toString(),
          quantidade: produto.quantidade.toString(),
          fornecedorId: produto.fornecedorId.toString()
        });
      }
    }
  }

  async salvarProduto() {
    if (this.formProduto.invalid) {
      this.formProduto.markAllAsTouched();
      return;
    }
    const produto: Produto = {
      id: this.produtoId ?? undefined,
      nome: this.formProduto.value.nome ?? '',
      preco: Number(this.formProduto.value.preco ?? 0),
      quantidade: Number(this.formProduto.value.quantidade ?? 0),
      fornecedorId: Number(this.formProduto.value.fornecedorId ?? 0)
    };
    if (this.produtoId) {
      await this.produtoService.updateProduto(produto);
      Swal.fire('Atualizado!', 'Produto atualizado com sucesso.', 'success');
    } else {
      await this.produtoService.addProduto(produto);
      Swal.fire('Cadastrado!', 'Produto cadastrado com sucesso.', 'success');
    }
    this.router.navigate(['/produtos/listar-produtos']);
  }
}