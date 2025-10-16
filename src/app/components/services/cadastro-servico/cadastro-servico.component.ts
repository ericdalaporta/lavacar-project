import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Produto } from '../../../models/produto.model';
import { Servico } from '../../../models/servico.model';
import { MensagensService } from '../../../shared/services/mensagens.service';
import { ProdutoService } from '../../../services/produto.service';
import { ProdutoServicoService } from '../../../services/produto-servico.service';
import { ServicoService } from '../../../services/servico.service';

@Component({
  selector: 'app-cadastro-servico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './cadastro-servico.component.html',
  styleUrl: './cadastro-servico.component.css'
})
export class CadastroServicoComponent implements OnInit {
  tituloPagina = 'Cadastrar Serviço';
  servicoId?: number;
  ordemAtual?: number;

  produtosDisponiveis: Produto[] = [];
  produtosSelecionados: Produto[] = [];

  formServico = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    descricao: new FormControl('', [Validators.maxLength(150)]),
    preco: new FormControl<number | null>(null, [Validators.required, Validators.min(0)])
  });

  constructor(
    private readonly servicoService: ServicoService,
    private readonly produtoService: ProdutoService,
    private readonly produtoServicoService: ProdutoServicoService,
    private readonly mensagensService: MensagensService,
    private readonly rotaAtiva: ActivatedRoute,
    private readonly roteador: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.carregarProdutos();
    const idParam = this.rotaAtiva.snapshot.paramMap.get('id');
    if (idParam) {
      this.servicoId = Number(idParam);
      this.tituloPagina = 'Editar Serviço';
      await this.carregarServico(this.servicoId);
      await this.carregarProdutosAssociados(this.servicoId);
    }
  }

  async salvarServico(): Promise<void> {
    if (this.formServico.invalid) {
      this.formServico.markAllAsTouched();
      return;
    }

    const servico = this.construirServico();

    try {
      let servicoId = this.servicoId;
      if (servicoId) {
        await this.servicoService.update(servico);
        await this.mensagensService.exibirSucesso('Serviço atualizado', 'Os dados do serviço foram atualizados com sucesso.');
      } else {
        servicoId = await this.servicoService.add(servico);
        await this.mensagensService.exibirSucesso('Serviço cadastrado', 'O serviço foi cadastrado com sucesso.');
      }

      if (!servicoId) {
        throw new Error('Não foi possível determinar o identificador do serviço.');
      }

      await this.produtoServicoService.substituirProdutosDoServico(
        servicoId,
        this.produtosSelecionados.map(produto => produto.id!).filter(Boolean)
      );

      this.formServico.reset();
      this.produtosSelecionados = [];
      this.servicoId = undefined;
      this.ordemAtual = undefined;
      this.tituloPagina = 'Cadastrar Serviço';
      await this.carregarProdutos();
      this.roteador.navigate(['/servicos/listar-servicos']);
    } catch (erro) {
      await this.mensagensService.exibirErro('Operação não concluída', 'Não foi possível salvar o serviço.');
      console.error('Erro ao salvar serviço', erro);
    }
  }

  aoOrganizarProdutos(evento: CdkDragDrop<Produto[]>): void {
    if (evento.previousContainer === evento.container) {
      moveItemInArray(evento.container.data, evento.previousIndex, evento.currentIndex);
      return;
    }

    transferArrayItem(
      evento.previousContainer.data,
      evento.container.data,
      evento.previousIndex,
      evento.currentIndex
    );
  }

  obterControle(nomeControle: keyof typeof this.formServico.controls) {
    return this.formServico.get(nomeControle);
  }

  contarCaracteresDescricao(): number {
    const valor = this.obterControle('descricao')?.value;
    if (!valor) {
      return 0;
    }
    return valor.toString().length;
  }

  limparFormulario(): void {
    this.formServico.reset();
    this.produtosSelecionados = [];
    this.carregarProdutos();
  }

  private construirServico(): Servico {
    const valores = this.formServico.value;
    return new Servico(
      valores.nome ?? '',
      valores.descricao ?? '',
      Number(valores.preco ?? 0),
      this.ordemAtual ?? 0,
      this.servicoId
    );
  }

  private async carregarProdutos(): Promise<void> {
    try {
      this.produtosDisponiveis = await this.produtoService.getAll();
      if (this.servicoId) {
        const idsSelecionados = new Set(this.produtosSelecionados.map(produto => produto.id));
        this.produtosDisponiveis = this.produtosDisponiveis.filter(produto => !idsSelecionados.has(produto.id));
      }
    } catch (erro) {
      await this.mensagensService.exibirErro('Falha ao carregar produtos', 'Não foi possível carregar os produtos disponíveis.');
      console.error('Erro ao carregar produtos', erro);
    }
  }

  private async carregarServico(id: number): Promise<void> {
    try {
      const servico = await this.servicoService.getById(id);
      if (!servico) {
        return;
      }

      this.formServico.patchValue({
        nome: servico.nome,
        descricao: servico.descricao,
        preco: servico.preco
      });
      this.ordemAtual = servico.ordem;
    } catch (erro) {
      await this.mensagensService.exibirErro('Falha ao carregar', 'Não foi possível carregar o serviço.');
      console.error('Erro ao carregar serviço', erro);
    }
  }

  private async carregarProdutosAssociados(id: number): Promise<void> {
    try {
      const associacoes = await this.produtoServicoService.getByServicoId(id);
      if (!associacoes.length) {
        return;
      }

      const produtos = await this.produtoService.getAll();
      const selecionados = produtos.filter(produto => associacoes.some(associacao => associacao.produtoId === produto.id));
      const idsSelecionados = new Set(selecionados.map(produto => produto.id));

      this.produtosSelecionados = selecionados;
      this.produtosDisponiveis = produtos.filter(produto => !idsSelecionados.has(produto.id));
    } catch (erro) {
      await this.mensagensService.exibirErro('Falha ao carregar produtos', 'Não foi possível carregar os produtos do serviço.');
      console.error('Erro ao carregar produtos associados', erro);
    }
  }
}