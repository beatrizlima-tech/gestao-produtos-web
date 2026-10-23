import { HttpClient } from '@angular/common/http';
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

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly apiUrl =
    'http://localhost:8081/api/v1/produtos';

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

  cadastrar() {
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid || this.salvando()) {
      return;
    }

    this.mensagemErro.set('');
    this.salvando.set(true);

    this.http.post(this.apiUrl, this.formulario.getRawValue())
      .subscribe({
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
