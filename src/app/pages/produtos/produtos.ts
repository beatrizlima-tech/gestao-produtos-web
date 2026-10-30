import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, computed } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import 'bootstrap/dist/js/bootstrap.esm.min.js';

@Component({
  selector: 'app-produtos',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css'
})
export class Produtos {

  private apiUrl = "http://localhost:8081/api/v1/produtos";

  private http = inject(HttpClient);

  produtos = signal<any[]>([]);

  carregando = signal(true);

  erroCarregamento = signal(false);

  busca = signal('');

  notificacao = signal('');

  precoExibicao = '';

  quantidadeExibicao = '';

  produtoParaExcluir = signal<any | null>(null);

  excluindo = signal(false);
  erroExclusao = signal('');
  confirmacaoExclusao = signal(false);

  salvandoEdicao = signal(false);
  erroEdicao = signal('');

  limparEdicao(): void {
    this.formEdicao.reset();
    this.precoExibicao = '';
    this.quantidadeExibicao = '';
    this.erroEdicao.set('');
  }

  produtosFiltrados = computed(() => {
    const termo = this.busca().trim().toLowerCase();

    return this.produtos().filter(produto =>
      produto.nome.toLowerCase().includes(termo)
    );
  });

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando.set(true);
    this.erroCarregamento.set(false);

    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.produtos.set(dados);
        this.carregando.set(false);
      },

      error: () => {
        this.produtos.set([]);
        this.erroCarregamento.set(true);
        this.carregando.set(false);
      }
    });
  }


  formatarPreco(event: Event): void {
    const input = event.target as HTMLInputElement;

    const formatoValido =
      /^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{0,2})?$/.test(input.value);

    if (input.value !== '' && !formatoValido) {

      this.precoExibicao = input.value;

      this.formEdicao.controls.preco.setValue('');
      this.formEdicao.controls.preco.markAsTouched();
      this.formEdicao.controls.preco.markAsDirty();

      return;
    }

    const texto = input.value.replace(/[^\d,]/g, '');
    const [inteiros = '', ...partesDecimais] = texto.split(',');

    const parteInteira = inteiros
      .replace(/^0+(?=\d)/, '');

    const decimais = partesDecimais
      .join('')
      .slice(0, 2);

    const possuiVirgula = texto.includes(',');

    const formatado = parteInteira
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      + (possuiVirgula ? ',' + decimais : '');

    this.precoExibicao = formatado;
    input.value = formatado;

    const numero = parteInteira
      ? Number(parteInteira + (possuiVirgula ? '.' + decimais : ''))
      : null;

    this.formEdicao.controls.preco.setValue(
      numero === null ? '' : String(numero)
    );

    this.formEdicao.controls.preco.markAsDirty();
  }

  formatarQuantidade(event: Event): void {
    const input = event.target as HTMLInputElement;
    const texto = input.value;

    const formatoValido =
      /^(?:\d+|\d{1,3}(?:\.\d{3})+)$/.test(texto);

    if (texto !== '' && !formatoValido) {

      this.quantidadeExibicao = texto;

      this.formEdicao.controls.quantidade.setValue('');
      this.formEdicao.controls.quantidade.markAsTouched();
      this.formEdicao.controls.quantidade.markAsDirty();

      return;
    }

    const digitos = texto.replace(/\./g, '');

    const quantidade = digitos.replace(/^0+(?=\d)/, '');

    this.quantidadeExibicao = quantidade.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      '.'
    );

    input.value = this.quantidadeExibicao;

    this.formEdicao.controls.quantidade.setValue(quantidade);
    this.formEdicao.controls.quantidade.markAsDirty();
  }


  formEdicao = new FormGroup({
    id: new FormControl('', [Validators.required]),

    nome: new FormControl('', [
      Validators.required,
      Validators.pattern(/.*\S.*/),
      Validators.maxLength(150)
    ]),

    preco: new FormControl('', [
      Validators.required,
      Validators.min(0.01)
    ]),

    quantidade: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.pattern(/^\d+$/)
    ]),

    descricao: new FormControl('', [Validators.maxLength(500)]),

    total: new FormControl('', [Validators.required]),
  });

  constructor() {
    this.formEdicao.controls.preco.valueChanges.subscribe(() => {
      this.recalcularTotal();
    });

    this.formEdicao.controls.quantidade.valueChanges.subscribe(() => {
      this.recalcularTotal();
    });
  }

  obterDados(id: number) {

    this.formEdicao.reset();
    this.precoExibicao = '';
    this.quantidadeExibicao = '';
    this.erroEdicao.set('');

    this.http.get(this.apiUrl + "/" + id)
      .subscribe((data: any) => {
        this.precoExibicao = Number(data.preco).toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        this.quantidadeExibicao = Number(data.quantidade).toLocaleString('pt-BR');
        this.formEdicao.patchValue({
          id: data.id,
          nome: data.nome,
          descricao: data.descricao ?? '',
          preco: data.preco,
          quantidade: data.quantidade,
          total: Number(data.total).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        });
      })
  }


  atualizar() {
    this.formEdicao.markAllAsTouched();

    if (this.formEdicao.invalid || this.salvandoEdicao()) {
      return;
    }

    this.salvandoEdicao.set(true);
    this.erroEdicao.set('');
    this.notificacao.set('');

    const produtoAtualizado = {
      nome: this.formEdicao.value.nome,
      descricao: this.formEdicao.value.descricao,
      preco: Number(this.formEdicao.value.preco),
      quantidade: Number(this.formEdicao.value.quantidade)
    };

    this.http.put<{ nome: string }>(
      `${this.apiUrl}/${this.formEdicao.value.id}`,
      produtoAtualizado
    ).subscribe({
      next: (produto) => {
        this.notificacao.set(
          `Produto "${produto.nome}" atualizado com sucesso!`
        );

        document
          .querySelector<HTMLButtonElement>('#modalEdicao .btn-close')
          ?.click();

        this.formEdicao.reset();
        this.salvandoEdicao.set(false);
        this.ngOnInit();
      },

      error: () => {
        this.erroEdicao.set(
          'Não foi possível atualizar o produto. Verifique os dados e tente novamente.'
        );

        this.salvandoEdicao.set(false);
      }
    });
  }

  selecionarProdutoParaExcluir(produto: any) {
    this.produtoParaExcluir.set(produto);
  }

  confirmarExclusao() {
    const produto = this.produtoParaExcluir();

    if (!produto || this.excluindo()) {
      return;
    }

    this.excluindo.set(true);
    this.erroExclusao.set('');

    this.http.delete(`${this.apiUrl}/${produto.id}`).subscribe({
      next: () => {
        this.notificacao.set(
          `Produto "${produto.nome}" movido para a lixeira com sucesso!`
        );

        document
          .querySelector<HTMLButtonElement>('#modalExclusao .btn-close')
          ?.click();

        this.produtoParaExcluir.set(null);
        this.excluindo.set(false);
        this.ngOnInit();
      },
      error: () => {
        this.erroExclusao.set(
          'Não foi possível mover o produto para a lixeira. Tente novamente.'
        );

        this.excluindo.set(false);
      }
    });
  }

  excluir(id: number) {
    if (confirm('Deseja realmente excluir este produto?')) {
      this.http.delete(this.apiUrl + "/" + id)
        .subscribe((data: any) => {
          this.notificacao.set(`Produto "${data.nome}" excluído com sucesso!`);
          this.ngOnInit();
        });
    }
  }

  private recalcularTotal(): void {
    const preco = Number(this.formEdicao.controls.preco.value) || 0;
    const quantidade = Number(this.formEdicao.controls.quantidade.value) || 0;

    const total = preco * quantidade;

    const totalFormatado = total.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    this.formEdicao.controls.total.setValue(totalFormatado, {
      emitEvent: false
    });
  }

}