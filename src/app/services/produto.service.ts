import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_PRODUTOS_URL } from '../config/api.config';
import { Produto, ProdutoLixeira } from '../models/produto.model';

export interface ProdutoRequest {
    nome: string;
    descricao: string | null;
    preco: number;
    quantidade: number;
}

@Injectable({
    providedIn: 'root'
})
export class ProdutoService{

    private readonly http = inject(HttpClient);
    private readonly apiUrl = API_PRODUTOS_URL;

    listar(): Observable<Produto[]> {
        return this.http.get<Produto[]>(this.apiUrl);
    }

    buscarPorId(id: number): Observable<Produto> {
        return this.http.get<Produto>(`${this.apiUrl}/${id}`);
    }

    cadastrar(dados: ProdutoRequest): Observable<Produto> {
        return this.http.post<Produto>(this.apiUrl, dados);
    }

    atualizar(
        id: number,
        dados: ProdutoRequest
    ): Observable<Produto> {
        return this.http.put<Produto>(
            `${this.apiUrl}/${id}`,
            dados
        );
    }

    moverParaLixeira(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    listarLixeira(): Observable<ProdutoLixeira[]> {
        return this.http.get<ProdutoLixeira[]> (
            `${this.apiUrl}/lixeira`
        );
    }

    restaurar(id: number): Observable<void> {
        return this.http.patch<void>(
            `${this.apiUrl}/${id}/restaurar`,
            {}
        );
    }

    excluirDefinitivamente(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}/definitivo`
        );
    }
}