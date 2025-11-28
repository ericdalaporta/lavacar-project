import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro-fornecedor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro-fornecedor.component.html',
  styleUrl: './cadastro-fornecedor.component.css'
})
export class CadastroFornecedorComponent implements OnInit {
  fornecedorId!: number;
  formFornecedor = new FormGroup({
    nome: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    cnpj: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/) 
    ]),
    fone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/) 
    ])
  });

  constructor(
    private fornecedorService: FornecedorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.fornecedorId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.fornecedorId) {
      const fornecedor = await this.fornecedorService.getFornecedorById(this.fornecedorId);
      if (fornecedor) {
        this.formFornecedor.setValue({
          nome: fornecedor.nome,
          cnpj: fornecedor.cnpj,
          fone: fornecedor.fone
        });
      }
    }
  }

  async addFornecedor() {
    if (this.formFornecedor.invalid) {
      this.formFornecedor.markAllAsTouched();
      return;
    }
    if (this.fornecedorId) {
      await this.editFornecedor();
    } else {
      const novoFornecedor: Fornecedor = {
        nome: this.formFornecedor.value.nome!,
        cnpj: this.formFornecedor.value.cnpj!,
        fone: this.formFornecedor.value.fone!
      };
      await this.fornecedorService.addFornecedor(novoFornecedor);
      Swal.fire('Cadastrado!', 'Fornecedor cadastrado com sucesso.', 'success');
      this.formFornecedor.reset();
      this.router.navigate(['fornecedores/listar-fornecedores']);
    }
  }

  formatarCNPJ(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '');
    
    if (valor.length > 14) {
      valor = valor.slice(0, 14);
    }
    
    if (valor.length <= 2) {
      input.value = valor;
    } else if (valor.length <= 5) {
      input.value = valor.slice(0, 2) + '.' + valor.slice(2);
    } else if (valor.length <= 8) {
      input.value = valor.slice(0, 2) + '.' + valor.slice(2, 5) + '.' + valor.slice(5);
    } else if (valor.length <= 12) {
      input.value = valor.slice(0, 2) + '.' + valor.slice(2, 5) + '.' + valor.slice(5, 8) + '/' + valor.slice(8);
    } else {
      input.value = valor.slice(0, 2) + '.' + valor.slice(2, 5) + '.' + valor.slice(5, 8) + '/' + valor.slice(8, 12) + '-' + valor.slice(12);
    }
    
    this.formFornecedor.patchValue({ cnpj: input.value });
  }

  async editFornecedor() {
    const fornecedorEditado: Fornecedor = {
      id: this.fornecedorId,
      nome: this.formFornecedor.value.nome!,
      cnpj: this.formFornecedor.value.cnpj!,
      fone: this.formFornecedor.value.fone!
    };
    await this.fornecedorService.updateFornecedor(fornecedorEditado);
    Swal.fire('Atualizado!', 'Fornecedor atualizado com sucesso.', 'success');
    this.router.navigate(['fornecedores/listar-fornecedores']);
  }

  get formControls() {
    return this.formFornecedor.controls;
  }
}