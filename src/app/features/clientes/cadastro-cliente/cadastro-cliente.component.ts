import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../services/cliente.service';
import { MensagensService } from '../../../shared/services/mensagens.service';

@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-cliente.component.html',
  styleUrl: './cadastro-cliente.component.css'
})
export class CadastroClienteComponent implements OnInit {
  tituloPagina = 'Cadastrar Cliente';
  clienteId?: number;
  imagemPreview: string;
  readonly fotoPadrao = 'assets/img/sem-foto.jpg';
  fotoCarregada = false;

  formCliente = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    telefone: new FormControl('', [Validators.required, Validators.pattern(/^\d{11}$|^\(\d{2}\) \d{4,5}-\d{4}$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    endereco: new FormControl('', [Validators.required, Validators.minLength(5)]),
    foto: new FormControl('')
  });

  constructor(
    private readonly clienteService: ClienteService,
    private readonly rotaAtiva: ActivatedRoute,
    private readonly roteador: Router,
    private readonly mensagensService: MensagensService
  ) {
    this.imagemPreview = this.fotoPadrao;
  }

  async ngOnInit(): Promise<void> {
    const idParam = this.rotaAtiva.snapshot.paramMap.get('id');
    if (idParam) {
      this.clienteId = Number(idParam);
      this.tituloPagina = 'Editar Cliente';
      await this.carregarCliente(this.clienteId);
    } else {
      this.imagemPreview = this.fotoPadrao;
      this.fotoCarregada = false;
    }
  }

  async salvarCliente(): Promise<void> {
    if (this.formCliente.invalid) {
      this.formCliente.markAllAsTouched();
      return;
    }

    const cliente = this.construirCliente();

    try {
      if (this.clienteId) {
        await this.clienteService.atualizar(cliente);
        await this.mensagensService.exibirSucesso('Cliente atualizado', 'Os dados do cliente foram atualizados com sucesso.');
      } else {
        await this.clienteService.adicionar(cliente);
        await this.mensagensService.exibirSucesso('Cliente cadastrado', 'O cliente foi cadastrado com sucesso.');
      }
      this.formCliente.reset();
      this.imagemPreview = this.fotoPadrao;
      this.fotoCarregada = false;
      this.roteador.navigate(['/clientes/listar-clientes']);
    } catch (erro) {
      await this.mensagensService.exibirErro('Operação não concluída', 'Ocorreu um problema ao salvar os dados do cliente.');
      console.error('Erro ao salvar cliente', erro);
    }
  }

  async aoSelecionarFoto(evento: Event): Promise<void> {
    const input = evento.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    if (!arquivo) {
      this.formCliente.patchValue({ foto: '' });
      this.imagemPreview = this.fotoPadrao;
      this.fotoCarregada = false;
      return;
    }

    try {
      const base64 = await this.converterArquivoParaBase64(arquivo);
      this.formCliente.patchValue({ foto: base64 });
      this.imagemPreview = base64;
      this.fotoCarregada = true;
    } catch (erro) {
      await this.mensagensService.exibirErro('Falha ao carregar imagem', 'Não foi possível carregar a foto escolhida.');
      console.error('Erro ao converter imagem', erro);
    }
  }

  limparFormulario(): void {
    this.formCliente.reset();
    this.imagemPreview = this.fotoPadrao;
    this.fotoCarregada = false;
  }

  private async carregarCliente(id: number): Promise<void> {
    try {
      const cliente = await this.clienteService.obterPorId(id);
      if (cliente) {
        this.formCliente.patchValue({
          nome: cliente.nome,
          telefone: cliente.telefone,
          email: cliente.email,
          endereco: cliente.endereco,
          foto: cliente.foto
        });
        this.imagemPreview = cliente.foto || this.fotoPadrao;
        this.fotoCarregada = !!cliente.foto;
      }
    } catch (erro) {
      await this.mensagensService.exibirErro('Falha ao carregar', 'Não foi possível carregar os dados do cliente.');
      console.error('Erro ao carregar cliente', erro);
    }
  }

  private construirCliente(): Cliente {
    const valores = this.formCliente.value;
    return new Cliente(
      valores.endereco ?? '',
      valores.nome ?? '',
      valores.telefone ?? '',
      valores.email ?? '',
      valores.foto ?? '',
      this.clienteId
    );
  }

  obterControle(nomeControle: keyof typeof this.formCliente.controls) {
    return this.formCliente.get(nomeControle);
  }

  private converterArquivoParaBase64(arquivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const leitor = new FileReader();
      leitor.onload = () => resolve(leitor.result?.toString() ?? '');
      leitor.onerror = erro => reject(erro);
      leitor.readAsDataURL(arquivo);
    });
  }
}
