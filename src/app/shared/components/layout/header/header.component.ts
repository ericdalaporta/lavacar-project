import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  modoEscuro: boolean;

  constructor(private readonly themeService: ThemeService) {
    this.modoEscuro = this.themeService.isModoEscuro();
  }

  alternarTema(): void {
    this.themeService.toggle();
    this.modoEscuro = this.themeService.isModoEscuro();
  }

}

