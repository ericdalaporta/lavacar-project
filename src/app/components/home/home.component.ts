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
    private toqueInicialX = 0;
    private toqueInicialY = 0;
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

    aoIniciarToque(evento: TouchEvent): void {
      this.toqueInicialX = evento.touches[0].clientX;
      this.toqueInicialY = evento.touches[0].clientY;
    }

    aoFinalizarToque(evento: TouchEvent): void {
      if (this.bloqueioScroll) {
        return;
      }

      const toqueFinalX = evento.changedTouches[0].clientX;
      const toqueFinalY = evento.changedTouches[0].clientY;
      const diferencaX = this.toqueInicialX - toqueFinalX;
      const diferencaY = this.toqueInicialY - toqueFinalY;

      // Só considera swipe horizontal se for maior que o vertical (evita conflito com scroll)
      if (Math.abs(diferencaX) < 50 || Math.abs(diferencaX) < Math.abs(diferencaY)) {
        return;
      }

      if (diferencaX > 0) {
        // Swipe para esquerda = avançar
        this.avancarSlide();
      } else {
        // Swipe para direita = voltar
        this.voltarSlide();
      }

      this.bloqueioScroll = true;
      window.clearTimeout(this.timerScroll);
      this.timerScroll = window.setTimeout(() => {
        this.bloqueioScroll = false;
      }, 420);
    }

}
