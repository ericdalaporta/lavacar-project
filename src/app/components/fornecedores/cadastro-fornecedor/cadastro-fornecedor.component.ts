import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ADICIONE ISSO!
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-fornecedor',
  standalone: true, // ADICIONE ISSO!
  imports: [ReactiveFormsModule, CommonModule], // ADICIONE ISSO!
  templateUrl: './cadastro-fornecedor.component.html',
  styleUrls: ['./cadastro-fornecedor.component.css'] // Corrija para styleUrls
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
      Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/) // 00.000.000/0000-00
    ]),
    fone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/) // (99) 99999-9999
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

  addFornecedor() {
    if (this.formFornecedor.invalid) {
      this.formFornecedor.markAllAsTouched(); // Isso faz aparecer o feedback visual!
      return;
    }
    if (this.fornecedorId) {
      this.editFornecedor();
    } else {
      const novoFornecedor: Fornecedor = {
        nome: this.formFornecedor.value.nome!,
        cnpj: this.formFornecedor.value.cnpj!,
        fone: this.formFornecedor.value.fone!
      };
      this.fornecedorService.addFornecedor(novoFornecedor).then(() => {
        this.formFornecedor.reset();
      });
    }
  }

  editFornecedor() {
    const fornecedorEditado: Fornecedor = {
      id: this.fornecedorId,
      nome: this.formFornecedor.value.nome!,
      cnpj: this.formFornecedor.value.cnpj!,
      fone: this.formFornecedor.value.fone!
    };
    this.fornecedorService.updateFornecedor(fornecedorEditado).then(() => {
      this.router.navigate(['fornecedores/listar-fornecedores']);
    });
  }

  get formControls() {
    return this.formFornecedor.controls;
  }
}