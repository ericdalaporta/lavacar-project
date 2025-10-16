import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Servico } from '../../../models/servico.model';
import { ServicoService } from '../../../services/servico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-servico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-servico.component.html',
  styleUrl: './listar-servico.component.css'
})
export class ListarServicosComponent implements OnInit {
  servicos: Servico[] = [];

  constructor(
    private servicoService: ServicoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllServicos();
  }

  getAllServicos() {
    this.servicoService.getAllServicos().then(servicos => {
      this.servicos = servicos;
    });
  }

  trackById(index: number, item: Servico) {
    return item.id;
  }

  editarServico(id: number) {
    this.router.navigate(['/servicos/editar-servico', id]);
  }

  excluirServico(id: number) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.servicoService.deleteServico(id).then(() => {
          Swal.fire('Excluído!', 'O serviço foi excluído com sucesso.', 'success');
          this.getAllServicos();
        });
      }
    });
  }
}