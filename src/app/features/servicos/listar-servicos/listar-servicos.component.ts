import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Produto } from '../../../models/produto.model';
import { Servico } from '../../../models/servico.model';
import { MensagensService } from '../../../shared/services/mensagens.service';
import { ProdutoService } from '../../../services/produto.service';
import { ProdutoServicoService } from '../../../services/produto-servico.service';
import { ServicoService } from '../../../services/servico.service';

interface ServicoDetalhado extends Servico {
  produtos: Produto[];
}

@Component({
  selector: 'app-listar-servicos-ordenados',
  standalone: true,
  imports: [CommonModule, DragDropModule, ReactiveFormsModule],
  templateUrl: './listar-servicos.component.html',
  styleUrl: './listar-servicos.component.css'
})
export class ListarServicosDragDropComponent implements OnInit {
  servicos: ServicoDetalhado[] = [];
  servicosFiltrados: ServicoDetalhado[] = [];
  carregando = false;
  readonly filtro = new FormControl('');

  constructor(
    private readonly servicoService: ServicoService,
    private readonly produtoService: ProdutoService,
    private readonly produtoServicoService: ProdutoServicoService,
    private readonly roteador: Router,
    private readonly mensagensService: MensagensService
  ) {}

  async ngOnInit(): Promise<void> {
    this.filtro.valueChanges.subscribe(valor => this.aplicarFiltro(valor ?? ''));
    await this.carregarServicos();
  }

  obterPreco(servico: ServicoDetalhado): number {
    return Number(servico.preco ?? 0);
  }

  async carregarServicos(): Promise<void> {
    this.carregando = true;
    try {
      const [servicos, associacoes, produtos] = await Promise.all([
        this.servicoService.obterTodosOrdenados(),
        this.produtoServicoService.getAll(),
        this.produtoService.getAll()
      ]);

      const mapaProdutos = new Map<number, Produto>();
      produtos.forEach(produto => {
        if (produto.id !== undefined) {
          mapaProdutos.set(produto.id, produto);
        }
      });

      this.servicos = servicos.map(servico => {
        const produtosDoServico = associacoes
          .filter(associacao => associacao.servicoId === servico.id)
          .map(associacao => mapaProdutos.get(associacao.produtoId))
          .filter((produto): produto is Produto => Boolean(produto));

        return { ...servico, produtos: produtosDoServico };
      });

      this.servicos.sort((primeiro, segundo) => (primeiro.ordem ?? 0) - (segundo.ordem ?? 0));
      this.aplicarFiltro(this.filtro.value ?? '');
    } catch (erro) {
      await this.mensagensService.exibirErro('Falha ao carregar', 'Não foi possível carregar os serviços.');
      console.error('Erro ao carregar serviços', erro);
    } finally {
      this.carregando = false;
    }
  }

  async aoReordenar(evento: CdkDragDrop<ServicoDetalhado[]>): Promise<void> {
    const filtroAtivo = this.filtro.value?.trim();
    if (filtroAtivo) {
      await this.mensagensService.exibirInformacao('Limpe o filtro', 'Remova o texto da pesquisa para reordenar os serviços.');
      this.aplicarFiltro(filtroAtivo);
      return;
    }

    moveItemInArray(this.servicosFiltrados, evento.previousIndex, evento.currentIndex);
    this.servicos = [...this.servicosFiltrados];
    this.servicos.forEach((servico, indice) => {
      servico.ordem = indice + 1;
    });

    try {
      const servicosParaAtualizar = this.servicos.map(({ produtos, ...dados }) =>
        new Servico(dados.nome, dados.descricao, dados.preco, dados.ordem, dados.id)
      );
      await this.servicoService.atualizarOrdem(servicosParaAtualizar);
      await this.mensagensService.exibirSucesso('Ordem atualizada', 'A nova ordem dos serviços foi salva.');
    } catch (erro) {
      await this.mensagensService.exibirErro('Erro ao salvar ordem', 'Não foi possível atualizar a ordem dos serviços.');
      console.error('Erro ao atualizar ordem dos serviços', erro);
      await this.carregarServicos();
    }
  }

  editarServico(id: number | undefined): void {
    if (!id) {
      return;
    }
    this.roteador.navigate(['/servicos/editar-servico', id]);
  }

  async excluirServico(id: number | undefined): Promise<void> {
    if (!id) {
      return;
    }

    const confirmar = await this.mensagensService.confirmarExclusao('Deseja remover este serviço?');
    if (!confirmar) {
      return;
    }

    try {
      await this.servicoService.deleteServico(id);
      await this.mensagensService.exibirSucesso('Serviço removido', 'O serviço foi removido com sucesso.');
      await this.carregarServicos();
    } catch (erro) {
      await this.mensagensService.exibirErro('Erro ao remover', 'Não foi possível remover o serviço.');
      console.error('Erro ao remover serviço', erro);
    }
  }

  trackById(indice: number, servico: ServicoDetalhado): number | undefined {
    return servico.id;
  }

  private aplicarFiltro(termo: string): void {
    const termoNormalizado = termo.toLowerCase().trim();
    if (!termoNormalizado) {
      this.servicosFiltrados = [...this.servicos];
      return;
    }

    this.servicosFiltrados = this.servicos.filter(servico => {
      const campos = [servico.nome, servico.descricao, servico.produtos.map(prod => prod.nome).join(' ')];
      return campos
        .filter(Boolean)
        .some(campo => campo!.toLowerCase().includes(termoNormalizado));
    });
  }
}
