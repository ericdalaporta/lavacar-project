import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Servico } from '../../../models/servico.model';
import { ServicoService } from '../../../services/servico.service';
@Component({
  selector: 'app-listar-servico',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2>Lista de Serviços</h2>
      <ul>
        <li *ngFor="let servico of servicos">
          {{ servico.nome }}
        </li>
      </ul>
    </div>
  `
})
export class ListarServicosComponent {
  servicos: Servico[] = [];
  constructor(private servicoService: ServicoService) { }
  ngOnInit() {
    this.getAllServicos();
  }
  getAllServicos() {
    this.servicoService.getAllServicos().then(servicos => {
      this.servicos = servicos;
      });
    }
  }
