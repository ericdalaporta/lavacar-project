import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface SlideInformativo {
  etapa: string;
  titulo: string;
  descricao: string;
  imagem: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  slides: SlideInformativo[] = [
    {
      etapa: 'Passo 1',
      titulo: 'Organize sua empresa',
      descricao: 'Cadastre clientes, agendamentos, serviços, produtos, funcionários e fornecedores em um só painel.',
      imagem: 'assets/img/SLIDE 1.png'
    },
    {
      etapa: 'Passo 2',
      titulo: 'Fácil de encontrar',
      descricao: 'Use as listas para visualizar tudo que está cadastrado, altere ou exclua com apenas alguns cliques.',
      imagem: 'assets/img/SLIDE 2.png'
    },
    {
      etapa: 'Passo 3',
      titulo: 'Conforto visual',
      descricao: 'Ative o modo noturno sempre que quiser uma experiência mais confortável durante o uso.',
      imagem: 'assets/img/SLIDE 3.png'
    }
  ];

    private bloqueioScroll = false;
    private timerScroll?: number;
  ativo = 0;

  selecionarSlide(indice: number): void {
    if (indice === this.ativo) {
      return;
    }
    this.ativo = indice;
  }
    aoRolar(evento: WheelEvent): void {
      evento.preventDefault();

      if (this.bloqueioScroll || evento.deltaY === 0) {
        return;
      }

      if (evento.deltaY > 0) {
        this.avancarSlide();
      } else {
        this.voltarSlide();
      }

      this.bloqueioScroll = true;
      window.clearTimeout(this.timerScroll);
      this.timerScroll = window.setTimeout(() => {
        this.bloqueioScroll = false;
      }, 420);
    }

    private avancarSlide(): void {
      const proximo = (this.ativo + 1) % this.slides.length;
      this.selecionarSlide(proximo);
    }

    private voltarSlide(): void {
      const anterior = (this.ativo - 1 + this.slides.length) % this.slides.length;
      this.selecionarSlide(anterior);
    }

}
