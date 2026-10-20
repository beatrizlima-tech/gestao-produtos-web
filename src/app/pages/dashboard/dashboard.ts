
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  total: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8081/api/v1/produtos';

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
    this.http.get<Produto[]>(this.apiUrl).subscribe({
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
