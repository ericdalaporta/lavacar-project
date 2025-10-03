import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from
  '@angular/forms';


import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Servico } from '../../../models/servico.model';
import { ServicoService } from '../../../services/servico.service';
@Component({
  selector: 'app-cadastro-servico'
  ,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cadastro-servico.component.html'
  ,
  styleUrl: './cadastro-servico.component.css'
})
export class CadastroServicoComponent {
  private fb = inject(FormBuilder);
  formServico = this.fb.group({
    nome: [''
      , Validators.required],
    descricao: [''],
    preco: [null as number | null, Validators.required],
    produtos: [null as number | null]
  });
  constructor(@Inject(ServicoService) private servicoService: ServicoService, private router: Router) { }
  addServico() {
    if (this.formServico.valid) {
      const novoServico: Servico = {
        nome: this.formServico.value.nome!,
        descricao: this.formServico.value.descricao!,
        preco: this.formServico.value.preco!
      }
      this.servicoService.addServico(novoServico).then(() => {
        Swal.fire('Cadastro realizado!', 'O serviço foi cadastrado com sucesso.',
          'success');
        this.router.navigate(['servicos/listar-servicos']);
      });
    }
  }
}