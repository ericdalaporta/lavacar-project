import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class MensagensService {
  exibirSucesso(titulo: string, mensagem: string): Promise<void> {
    return this.exibirAlerta('success', titulo, mensagem);
  }

  exibirErro(titulo: string, mensagem: string): Promise<void> {
    return this.exibirAlerta('error', titulo, mensagem);
  }

  exibirInformacao(titulo: string, mensagem: string): Promise<void> {
    return this.exibirAlerta('info', titulo, mensagem);
  }

  confirmarExclusao(mensagem: string): Promise<boolean> {
    return Swal.fire({
      title: 'Você tem certeza?',
      text: mensagem,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0d6efd'
    }).then(resultado => resultado.isConfirmed);
  }

  private exibirAlerta(icone: SweetAlertIcon, titulo: string, mensagem: string): Promise<void> {
    return Swal.fire({
      icon: icone,
      title: titulo,
      text: mensagem,
      confirmButtonColor: '#0d6efd'
    }).then(() => undefined);
  }
}
