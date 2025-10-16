import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
	private readonly storageKey = 'lavacar-theme';
	private readonly darkClass = 'theme-dark';

	constructor(@Inject(DOCUMENT) private readonly document: Document) {
		const preferencia = this.obterPreferencia() ?? (this.prefereModoEscuro() ? 'dark' : 'light');
		this.aplicarTema(preferencia, false);
	}

	isModoEscuro(): boolean {
		return this.document.documentElement.classList.contains(this.darkClass);
	}

	toggle(): void {
		const proximo = this.isModoEscuro() ? 'light' : 'dark';
		this.aplicarTema(proximo);
	}

	definirTema(modo: ThemeMode): void {
		this.aplicarTema(modo);
	}

	private aplicarTema(modo: ThemeMode, persistir = true): void {
		const corpo = this.document.body;
		if (modo === 'dark') {
			this.document.documentElement.classList.add(this.darkClass);
			corpo?.classList.add(this.darkClass);
		} else {
			this.document.documentElement.classList.remove(this.darkClass);
			corpo?.classList.remove(this.darkClass);
		}

		if (persistir) {
			this.salvarPreferencia(modo);
		}
	}

	private salvarPreferencia(modo: ThemeMode): void {
		if (!this.temArmazenamento()) {
			return;
		}
		try {
			window.localStorage.setItem(this.storageKey, modo);
		} catch (error) {
			console.warn('Não foi possível salvar a preferência de tema.', error);
		}
	}

	private obterPreferencia(): ThemeMode | null {
		if (!this.temArmazenamento()) {
			return null;
		}
		try {
			const armazenado = window.localStorage.getItem(this.storageKey) as ThemeMode | null;
			return armazenado === 'dark' || armazenado === 'light' ? armazenado : null;
		} catch {
			return null;
		}
	}

	private prefereModoEscuro(): boolean {
		return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
	}

	private temArmazenamento(): boolean {
		return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
	}
}
