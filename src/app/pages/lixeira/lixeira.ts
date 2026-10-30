
import { Component, inject, signal } from '@angular/core';
import { LucideClock3, LucideHash, LucideInfo, LucidePackage, LucideRotateCcw, LucideTrash, LucideWallet } from '@lucide/angular';
import 'bootstrap/dist/js/bootstrap.esm.min.js';
import { ProdutoLixeira } from '../../models/produto.model';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-lixeira',
  imports: [LucideRotateCcw,
    LucideTrash,
    LucideClock3,
    LucideHash,
    LucidePackage,
    LucideWallet,
    LucideInfo
  ],
  templateUrl: './lixeira.html',
  styleUrl: './lixeira.css'
})
export class Lixeira {

  private readonly produtoService = inject(ProdutoService);

  produtosExcluidos = signal<ProdutoLixeira[]>([]);
  carregando = signal(true);
  erro = signal('');
  restaurandoId = signal<number | null>(null);
  mensagemSucesso = signal('');
  erroRestauracao = signal('');
  produtoParaRestaurar = signal<ProdutoLixeira | null>(null);
  confirmacaoRestauracao = signal(false);

  produtoParaExcluirDefinitivamente = signal<ProdutoLixeira | null>(null);
  confirmacaoExclusaoDefinitiva = signal(false);
  excluindoDefinitivamente = signal(false);
  erroExclusaoDefinitiva = signal('');

  selecionarProdutoParaExcluirDefinitivamente(produto: ProdutoLixeira) {
    this.produtoParaExcluirDefinitivamente.set(produto);
    this.confirmacaoExclusaoDefinitiva.set(false);
    this.erroExclusaoDefinitiva.set('');
  }

  selecionarProdutoParaRestaurar(produto: ProdutoLixeira) {
    this.produtoParaRestaurar.set(produto);
    this.confirmacaoRestauracao.set(false);
    this.erroRestauracao.set('');
  }

  diasRestantes(dataExclusao: string | null): number | null {
    if (!dataExclusao) {
      return null;
    }

    const data = new Date(dataExclusao);

    if (Number.isNaN(data.getTime())) {
      return null;
    }

    const prazoEmDias = 30;
    const milissegundosPorDia = 24 * 60 * 60 * 1000;

    const dataLimite =
      data.getTime() + prazoEmDias * milissegundosPorDia;

    const diferenca =
      dataLimite - Date.now();

    return Math.max(
      0,
      Math.ceil(diferenca / milissegundosPorDia)
    );
  }

  restaurarProduto(produto: ProdutoLixeira) {
    if (this.restaurandoId() !== null) {
      return;
    }

    this.restaurandoId.set(produto.id);
    this.mensagemSucesso.set('');
    this.erroRestauracao.set('');

    this.produtoService.restaurar(produto.id).subscribe({

      next: () => {
        this.produtosExcluidos.update(produtos =>
          produtos.filter(item => item.id !== produto.id)
        );

        this.mensagemSucesso.set(
          `Produto "${produto.nome}" restaurado com sucesso!`
        );

        document
          .querySelector<HTMLButtonElement>('#modalRestauracao .btn-close')
          ?.click();

        this.restaurandoId.set(null);
      },

      error: () => {
        this.restaurandoId.set(null);
        this.erroRestauracao.set('Não foi possível restaurar o produto. Tente novamente.')
      }
    });
  }

  excluirProdutoDefinitivamente(produto: ProdutoLixeira) {
    if (this.excluindoDefinitivamente()) {
      return;
    }

    this.excluindoDefinitivamente.set(true);
    this.erroExclusaoDefinitiva.set('');
    this.mensagemSucesso.set('');

    this.produtoService.excluirDefinitivamente(produto.id).subscribe({
      next: () => {
        this.produtosExcluidos.update(produtos =>
          produtos.filter(item => item.id !== produto.id)
        );

        this.mensagemSucesso.set(
          `Produto "${produto.nome}" excluído definitivamente com sucesso!`
        );

        document
          .querySelector<HTMLButtonElement>(
            '#modalExclusaoDefinitiva .btn-close'
          )
          ?.click();

        this.excluindoDefinitivamente.set(false);
      },

      error: () => {
        this.erroExclusaoDefinitiva.set(
          'Não foi possível excluir o produto definitivamente. Tente novamente.'
        );

        this.excluindoDefinitivamente.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.produtoService.listarLixeira().subscribe({
      next: (produtos) => {
        this.produtosExcluidos.set(produtos);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(
          'Não foi possível carregar os produtos da lixeira.'
        );
        this.carregando.set(false);
      }
    });
  }
}
