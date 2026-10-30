import { vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';

import { Lixeira } from './lixeira';

describe('Lixeira', () => {
    let component: Lixeira;
    let fixture: ComponentFixture<Lixeira>;
    let httpMock: HttpTestingController;

    const apiUrl = 'http://localhost:8081/api/v1/produtos';

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Lixeira],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(Lixeira);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('deve carregar os produtos da lixeira', () => {
        fixture.detectChanges();

        const requisicao = httpMock.expectOne(
            `${apiUrl}/lixeira`
        );

        expect(requisicao.request.method).toBe('GET');

        requisicao.flush([]);

        expect(component.produtosExcluidos()).toEqual([]);
        expect(component.carregando()).toBe(false);
        expect(component.erro()).toBe('');
    });

    it('deve informar quando a listagem falhar', () => {
        fixture.detectChanges();

        const requisicao = httpMock.expectOne(
            `${apiUrl}/lixeira`
        );

        requisicao.flush('Erro interno', {
            status: 500,
            statusText: 'Internal Server Error'
        });

        expect(component.carregando()).toBe(false);
        expect(component.erro()).toContain(
            'Não foi possível carregar'
        );
    });

    it('deve restaurar um produto com sucesso', () => {
        const produto = {
            id: 52,
            nome: 'Notebook Lenovo',
            descricao: 'Notebook para desenvolvimento',
            preco: 2500,
            quantidade: 1,
            total: 2500,
            dataExclusao: '2026-10-29T10:00:00'
        };

        component.produtosExcluidos.set([produto]);

        component.restaurarProduto(produto);

        const requisicao = httpMock.expectOne(
            `${apiUrl}/52/restaurar`
        );

        expect(requisicao.request.method).toBe('PATCH');
        expect(component.restaurandoId()).toBe(52);

        requisicao.flush(null);

        expect(component.produtosExcluidos()).toEqual([]);

        expect(component.restaurandoId()).toBe(null);
        expect(component.mensagemSucesso()).toContain(
            'restaurado com sucesso'
        );
    });

    it('deve excluir definitivamente um produto com sucesso', () => {
        const produto = {
            id: 52,
            nome: 'Notebook Lenovo',
            descricao: 'Notebook para desenvolvimento',
            preco: 2500,
            quantidade: 1,
            total: 2500,
            dataExclusao: '2026-10-29T10:00:00'
        };

        component.produtosExcluidos.set([produto]);

        component.excluirProdutoDefinitivamente(produto);

        const requisicao = httpMock.expectOne(
            `${apiUrl}/52/definitivo`
        );

        expect(requisicao.request.method).toBe('DELETE');

        expect(component.excluindoDefinitivamente()).toBe(true);
        expect(component.produtosExcluidos()).toEqual([produto]);

        requisicao.flush(null);

        expect(component.produtosExcluidos()).toEqual([]);
        expect(component.excluindoDefinitivamente()).toBe(false);

        expect(component.mensagemSucesso()).toContain(
            'excluído definitivamente com sucesso'
        );
    });

    it('deve manter o produto na lixeira quando a restauração falhar', () => {
        const produto = {
            id: 52,
            nome: 'Notebook Lenovo',
            descricao: 'Notebook para desenvolvimento',
            preco: 2500,
            quantidade: 1,
            total: 2500,
            dataExclusao: '2026-10-29T10:00:00'
        };

        component.produtosExcluidos.set([produto]);

        component.restaurarProduto(produto);

        const requisicao = httpMock.expectOne(
            `${apiUrl}/52/restaurar`
        );

        expect(requisicao.request.method).toBe('PATCH');
        expect(component.restaurandoId()).toBe(52);

        requisicao.flush('Erro interno', {
            status: 500,
            statusText: 'Internal Server Error'
        });

        expect(component.produtosExcluidos()).toEqual([produto]);

        expect(component.restaurandoId()).toBe(null);
        expect(component.erroRestauracao()).toContain(
            'Não foi possível restaurar'
        );

        expect(component.mensagemSucesso()).toBe('');
    });

    it('deve manter o produto na lixeira quando a exclusão definitiva falhar', () => {
        const produto = {
            id: 52,
            nome: 'Notebook Lenovo',
            descricao: 'Notebook para desenvolvimento',
            preco: 2500,
            quantidade: 1,
            total: 2500,
            dataExclusao: '2026-10-29T10:00:00'
        };

        component.produtosExcluidos.set([produto]);

        component.excluirProdutoDefinitivamente(produto);

        const requisicao = httpMock.expectOne(
            `${apiUrl}/52/definitivo`
        );

        expect(requisicao.request.method).toBe('DELETE');
        expect(component.excluindoDefinitivamente()).toBe(true);

        requisicao.flush('Erro interno', {
            status: 500,
            statusText: 'Internal Server Error'
        });

        expect(component.produtosExcluidos()).toEqual([produto]);

        expect(component.excluindoDefinitivamente()).toBe(false);
        expect(component.erroExclusaoDefinitiva()).toContain(
            'Não foi possível excluir'
        );

        expect(component.mensagemSucesso()).toBe('');
    });

    it('deve calcular corretamente os dias restantes na lixeira', () => {
        const agora = new Date('2026-10-30T12:00:00Z');

        const relogio = vi.spyOn(Date, 'now')
            .mockReturnValue(agora.getTime());

        try {
            expect (
                component.diasRestantes('2026-10-20T12:00:00Z')
            ).toBe(20);

            expect(
                component.diasRestantes('2026-09-01T12:00:00Z')
            ).toBe(0);

            expect(component.diasRestantes(null)).toBeNull();

            expect (
                component.diasRestantes('data-invalida')
            ).toBeNull();
        } finally {
            relogio.mockRestore();
        }
    });

});
