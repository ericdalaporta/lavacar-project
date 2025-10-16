import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Funcionario } from '../../../models/funcionario.model';
import { FuncionarioService } from '../services/funcionario.service';
import { MensagensService } from '../../../shared/services/mensagens.service';

@Component({
  selector: 'app-cadastro-funcionario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-funcionario.component.html',
  styleUrl: './cadastro-funcionario.component.css'
})
export class CadastroFuncionarioComponent implements OnInit {
  tituloPagina = 'Cadastrar Funcionário';
  funcionarioId?: number;
  fotoCarregada = false;

  formFuncionario = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    telefone: new FormControl('', [Validators.required, Validators.pattern(/^\d{11}$|^\(\d{2}\) \d{4,5}-\d{4}$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    foto: new FormControl(''),
    funcao: new FormControl('', [Validators.required]),
    dataAdmissao: new FormControl('', [Validators.required])
  });

  constructor(
    private readonly funcionarioService: FuncionarioService,
    private readonly rotaAtiva: ActivatedRoute,
    private readonly roteador: Router,
    private readonly mensagensService: MensagensService
  ) {}

  async ngOnInit(): Promise<void> {
    const idParam = this.rotaAtiva.snapshot.paramMap.get('id');
    if (idParam) {
      this.funcionarioId = Number(idParam);
      this.tituloPagina = 'Editar Funcionário';
      await this.carregarFuncionario(this.funcionarioId);
    } else {
      this.fotoCarregada = false;
    }
  }

  async salvarFuncionario(): Promise<void> {
    if (this.formFuncionario.invalid) {
      this.formFuncionario.markAllAsTouched();
      return;
    }

    const funcionario = this.construirFuncionario();

    try {
      if (this.funcionarioId) {
        await this.funcionarioService.atualizar(funcionario);
        await this.mensagensService.exibirSucesso('Funcionário atualizado', 'Os dados do funcionário foram atualizados.');
      } else {
        await this.funcionarioService.adicionar(funcionario);
        await this.mensagensService.exibirSucesso('Funcionário cadastrado', 'O funcionário foi cadastrado com sucesso.');
      }
      this.limparFormulario();
      this.roteador.navigate(['/funcionarios/listar-funcionarios']);
    } catch (erro) {
      await this.mensagensService.exibirErro('Operação não concluída', 'Não foi possível salvar os dados do funcionário.');
      console.error('Erro ao salvar funcionário', erro);
    }
  }

  private async carregarFuncionario(id: number): Promise<void> {
    try {
      const funcionario = await this.funcionarioService.obterPorId(id);
      if (funcionario) {
        this.formFuncionario.patchValue({
          nome: funcionario.nome,
          telefone: funcionario.telefone,
          email: funcionario.email,
          foto: funcionario.foto,
          funcao: funcionario.funcao,
          dataAdmissao: funcionario.dataAdmissao
            ? new Date(funcionario.dataAdmissao).toISOString().substring(0, 10)
            : ''
        });
        this.fotoCarregada = !!funcionario.foto;
      }
    } catch (erro) {
      await this.mensagensService.exibirErro('Falha ao carregar', 'Não foi possível carregar o funcionário.');
      console.error('Erro ao carregar funcionário', erro);
    }
  }

  async aoSelecionarFoto(evento: Event): Promise<void> {
    const input = evento.target as HTMLInputElement;
    const arquivo = input.files?.[0];

    if (!arquivo) {
      this.formFuncionario.patchValue({ foto: '' });
      this.fotoCarregada = false;
      return;
    }

    try {
      const base64 = await this.converterArquivoParaBase64(arquivo);
      this.formFuncionario.patchValue({ foto: base64 });
      this.fotoCarregada = true;
    } catch (erro) {
      await this.mensagensService.exibirErro('Falha ao carregar imagem', 'Não foi possível carregar a foto escolhida.');
      console.error('Erro ao converter imagem', erro);
    }
  }

  limparFormulario(): void {
    this.formFuncionario.reset();
    this.fotoCarregada = false;
  }

  private construirFuncionario(): Funcionario {
    const valores = this.formFuncionario.value;
    const dataAdmissao = valores.dataAdmissao ? new Date(valores.dataAdmissao) : null;

    return new Funcionario(
      valores.funcao ?? '',
      dataAdmissao,
      valores.nome ?? '',
      valores.telefone ?? '',
      valores.email ?? '',
      valores.foto ?? '',
      this.funcionarioId
    );
  }

  obterControle(nomeControle: keyof typeof this.formFuncionario.controls) {
    return this.formFuncionario.get(nomeControle);
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
