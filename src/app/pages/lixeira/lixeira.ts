
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LucideClock3, LucideHash, LucideInfo, LucidePackage, LucideRotateCcw, LucideTrash, LucideWallet } from '@lucide/angular';

interface ProdutoLixeira {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  quantidade: number;
  total: number;
  dataExclusao: string | null;
}

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

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8081/api/v1/produtos/lixeira';

  produtosExcluidos = signal<ProdutoLixeira[]>([]);
  carregando = signal(true);
  erro = signal('');
  restaurandoId = signal<number | null>(null);
  mensagemSucesso = signal('');

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

  ngOnInit() {
    this.http.get<ProdutoLixeira[]>(this.apiUrl).subscribe({
      next: (produtos) => {
        this.produtosExcluidos.set(produtos);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os produtos da lixeira.');
        this.carregando.set(false);
      }
    });
  }
}
