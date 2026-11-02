
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { RouterLink } from '@angular/router';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private readonly produtoService = inject(ProdutoService);

  readonly produtos = signal<Produto[]>([]);
  readonly carregando = signal(true);
  readonly erro = signal(false);

  readonly totalProdutos = computed(() =>
    this.produtos().length
  );

  readonly totalUnidades = computed(() =>
    this.produtos().reduce(
      (soma, produto) => soma + produto.quantidade,
      0
    )
  );

  readonly valorEstoque = computed(() =>
    this.produtos().reduce(
      (soma, produto) => soma + produto.total,
      0
    )
  );

  readonly valorFormatado = computed(() =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.valorEstoque())
  );

  ngOnInit(): void {
    this.produtoService.listar().subscribe({
      next: (dados) => {
        this.produtos.set(dados);
        this.carregando.set(false);
      },

      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
      }
    });
  }

}
