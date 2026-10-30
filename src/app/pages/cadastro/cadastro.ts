import { ProdutoService } from '../../services/produto.service';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {

  private readonly produtoService = inject(ProdutoService);
  private readonly router = inject(Router);

  readonly salvando = signal(false);
  readonly mensagemErro = signal('');

  formulario = new FormGroup({
    nome: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(/.*\S.*/),
        Validators.maxLength(150)
      ]
    }),

    descricao: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.maxLength(500)
      ]
    }),

    preco: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0.01)
    ]),

    quantidade: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
      Validators.pattern(/^\d+$/)
    ])
  });

  cadastrar(): void {
    this.formulario.markAllAsTouched();

    const dados = this.formulario.getRawValue();

    if (
      this.formulario.invalid ||
      this.salvando() ||
      dados.preco === null ||
      dados.quantidade === null
    ) {
      return;
    }

    this.mensagemErro.set('');
    this.salvando.set(true);

    this.produtoService.cadastrar({
      nome: dados.nome,
      descricao: dados.descricao,
      preco: dados.preco,
      quantidade: dados.quantidade
    }).subscribe({
      next: () => {
        this.router.navigate(['/produtos']);
      },

      error: () => {
        this.mensagemErro.set(
          'Não foi possível cadastrar o produto. Tente novamente.'
        );

        this.salvando.set(false);
      }
    });
  }


}
