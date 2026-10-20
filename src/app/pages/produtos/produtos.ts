import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, computed } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-produtos',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css'
})
export class Produtos {
  
  private apiUrl = "http://localhost:8081/api/v1/produtos";
  
  private http = inject(HttpClient);

  produtos = signal<any[]>([]);

  busca = signal('');

  produtosFiltrados = computed(() => {
    const termo = this.busca().trim().toLowerCase();

    return this.produtos().filter(produto =>
      produto.nome.toLowerCase().includes(termo)
    );
  });

  ngOnInit() {
    this.http.get(this.apiUrl)
      .subscribe((data) => {
        this.produtos.set(data as any[]);
      })
  }

  formCadastro = new FormGroup({
    nome : new FormControl('', [Validators.required]),
    preco : new FormControl('', [Validators.required]),
    quantidade : new FormControl('', [Validators.required])
  });

  formEdicao = new FormGroup({
    id : new FormControl('', [Validators.required]),
    nome : new FormControl('', [Validators.required]),
    preco : new FormControl('', [Validators.required]),
    quantidade : new FormControl('', [Validators.required]),
    total : new FormControl('', [Validators.required]),
  });

  cadastrar() {
    this.http.post(this.apiUrl, this.formCadastro.value)
      .subscribe((data: any) => {
        alert(`Produto "${data.nome}", cadastrado com sucesso!`);
        this.formCadastro.reset();
        this.ngOnInit();
      })
  }

  obterDados(id: number) {
    this.http.get(this.apiUrl + "/" + id)
      .subscribe((data: any) => {
        this.formEdicao.patchValue({
          id: data.id,
          nome: data.nome,
          preco: data.preco,
          quantidade: data.quantidade,
          total: data.total
        });
      })
  }

  atualizar() {
    this.http.put(this.apiUrl + "/" + this.formEdicao.value.id, this.formEdicao.value)
      .subscribe((data: any) => {
        alert(`Produto "${data.nome}", atualizado com sucesso!`);
        this.formEdicao.reset();
        this.ngOnInit();
      })
  }

  excluir(id: number) {
    if(confirm('Deseja realmente excluir este produto?')) {
      this.http.delete(this.apiUrl + "/" + id)
        .subscribe((data: any) => {
          alert(`Produto "${data.nome}", excluído com sucesso!`);
          this.ngOnInit();
        });
    }
  }

}