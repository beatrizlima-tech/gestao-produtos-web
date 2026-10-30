import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { Produtos } from './produtos';

registerLocaleData(localePt);

describe('Produtos', () => {
  let component: Produtos;
  let fixture: ComponentFixture<Produtos>;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:8081/api/v1/produtos';

  const produto = {
    id: 52,
    nome: 'Notebook Lenovo',
    descricao: 'Notebook para trabalho',
    preco: 5000,
    quantidade: 9,
    total: 45000
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Produtos],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LOCALE_ID, useValue: 'pt-BR' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Produtos);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    const requisicao = httpMock.expectOne(apiUrl);
    expect(requisicao.request.method).toBe('GET');

    requisicao.flush([produto]);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve listar e filtrar produtos pelo nome', () => {
    expect(component.produtos().length).toBe(1);

    component.busca.set('lenovo');

    expect(component.produtosFiltrados().length).toBe(1);
    expect(component.produtosFiltrados()[0].id).toBe(52);

    component.busca.set('produto inexistente');

    expect(component.produtosFiltrados().length).toBe(0);
  });

  it('não deve atualizar um formulário inválido', () => {
    component.atualizar();

    expect(component.formEdicao.invalid).toBe(true);
    expect(component.salvandoEdicao()).toBe(false);

    httpMock.expectNone(`${apiUrl}/52`);
  });

  it('deve preservar a descrição ao atualizar o preço', () => {
    component.obterDados(52);

    const consulta = httpMock.expectOne(`${apiUrl}/52`);
    expect(consulta.request.method).toBe('GET');

    consulta.flush(produto);

    component.formEdicao.controls.preco.setValue('6000');
    component.atualizar();

    const atualizacao = httpMock.expectOne(`${apiUrl}/52`);

    expect(atualizacao.request.method).toBe('PUT');
    expect(atualizacao.request.body).toEqual({
      nome: 'Notebook Lenovo',
      descricao: 'Notebook para trabalho',
      preco: 6000,
      quantidade: 9
    });

    atualizacao.flush('Erro interno', {
      status: 500,
      statusText: 'Internal Server Error'
    });

    expect(component.salvandoEdicao()).toBe(false);
    expect(component.erroEdicao()).toContain(
      'Não foi possível atualizar'
    );
  });

  it('não deve transformar preço negativo em positivo', () => {

    component.formEdicao.setValue({
      id: '52',
      nome: 'Notebook Lenovo',
      descricao: 'Notebook para trabalho',
      preco: '5000',
      quantidade: '9',
      total: '45.000,00'
    });

    expect(component.formEdicao.valid).toBe(true);

    const input = document.createElement('input');
    input.value = '-10,00';

    component.formatarPreco({
      target: input
    } as unknown as Event);

    expect(component.formEdicao.controls.preco.invalid).toBe(true);

    expect(component.formEdicao.controls.preco.value).not.toBe('10');
  });

  it('não deve converter ponto decimal em valor maior', () => {
    const input = document.createElement('input');
    input.value = '12.50';

    component.formatarPreco({
      target: input
    } as unknown as Event);

    expect(component.formEdicao.controls.preco.invalid).toBe(true);

    expect(component.formEdicao.controls.preco.value).not.toBe('1250');
  });

  it('deve aceitar preço brasileiro com centavos', () => {
    const input = document.createElement('input');
    input.value = '12,50';

    component.formatarPreco({
      target: input
    } as unknown as Event);

    expect(component.precoExibicao).toBe('12,50');
    expect(component.formEdicao.controls.preco.value).toBe('12.5');
    expect(component.formEdicao.controls.preco.valid).toBe(true);
  });

  it('deve aceitar preço com separador de milhares', () => {
    const input = document.createElement('input');
    input.value = '1.250,50';

    component.formatarPreco({
      target: input
    } as unknown as Event);

    expect(component.precoExibicao).toBe('1.250,50');
    expect(component.formEdicao.controls.preco.value).toBe('1250.5');
    expect(component.formEdicao.controls.preco.valid).toBe(true);
  });

  it('não deve transformar quantidade negativa em positiva', () => {
    const input = document.createElement('input');
    input.value = '-1';

    component.formatarQuantidade({
      target: input
    } as unknown as Event);

    expect(component.formEdicao.controls.quantidade.invalid).toBe(true);
    expect(component.formEdicao.controls.quantidade.value).not.toBe('1');
  });

  it('deve aceitar quantidade zero', () => {
    const input = document.createElement('input');
    input.value = '0';

    component.formatarQuantidade({
      target: input
    } as unknown as Event);

    expect(component.quantidadeExibicao).toBe('0');
    expect(component.formEdicao.controls.quantidade.value).toBe('0');
    expect(component.formEdicao.controls.quantidade.valid).toBe(true);
  });

  it('deve formatar milhares sem alterar a quantidade', () => {
    const input = document.createElement('input');
    input.value = '1000';

    component.formatarQuantidade({
      target: input
    } as unknown as Event);

    expect(component.quantidadeExibicao).toBe('1.000');
    expect(component.formEdicao.controls.quantidade.value).toBe('1000');
    expect(component.formEdicao.controls.quantidade.valid).toBe(true);
  });

  it('deve recalcular o total ao alterar preço ou quantidade', () => {
    component.formEdicao.controls.preco.setValue('12.5');

    component.formEdicao.controls.quantidade.setValue('3');

    expect(component.formEdicao.controls.total.value).toBe('37,50');

    component.formEdicao.controls.quantidade.setValue('4');

    expect(component.formEdicao.controls.total.value).toBe('50,00');

    component.formEdicao.controls.preco.setValue('20');

    expect(component.formEdicao.controls.total.value).toBe('80,00');
  });

  it('deve mostrar erro quando a listagem falhar', () => {
    component.carregarProdutos();

    expect(component.carregando()).toBe(true);

    const requisicao = httpMock.expectOne(apiUrl);

    requisicao.flush('Erro interno', {
      status: 500,
      statusText: 'Internal Server Error'
    });

    fixture.detectChanges();

    expect(component.carregando()).toBe(false);
    expect(component.erroCarregamento()).toBe(true);

    const tela = fixture.nativeElement as HTMLElement;

    expect(tela.textContent).toContain(
      'Não foi possível carregar os produtos'
    );

    expect(tela.textContent).not.toContain(
      'Seu catálogo está vazio'
    );
  });


  it('deve mostrar catálogo vazio quando a API retornar lista vazia', async () => {
    component.carregarProdutos();

    const requisicao = httpMock.expectOne(apiUrl);

    expect(requisicao.request.method).toBe('GET');

    requisicao.flush([]);

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.carregando()).toBe(false);
    expect(component.erroCarregamento()).toBe(false);
    expect(component.produtos()).toEqual([]);

    const tela = fixture.nativeElement as HTMLElement;

    expect(tela.textContent).toContain(
      'Seu catálogo está vazio'
    );

    expect(tela.textContent).not.toContain(
      'Notebook Lenovo'
    );

    expect(tela.textContent).not.toContain(
      'Não foi possível carregar os produtos'
    );
  });

  it('deve permitir tentar carregar os produtos novamente', async () => {

    component.carregarProdutos();

    const primeiraRequisicao = httpMock.expectOne(apiUrl);

    primeiraRequisicao.flush('Erro interno', {
      status: 500,
      statusText: 'Internal Server Error'
    });

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.erroCarregamento()).toBe(true);

    const tela = fixture.nativeElement as HTMLElement;

    const botao = Array.from(
      tela.querySelectorAll('button')
    ).find(elemento =>
      elemento.textContent?.trim() === 'Tentar novamente'
    );

    expect(botao).toBeTruthy();

    botao!.click();

    const segundaRequisicao = httpMock.expectOne(apiUrl);

    expect(segundaRequisicao.request.method).toBe('GET');

    segundaRequisicao.flush([produto]);

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.erroCarregamento()).toBe(false);
    expect(component.carregando()).toBe(false);
    expect(component.produtos()).toEqual([produto]);

    expect(tela.textContent).toContain('Notebook Lenovo');
    expect(tela.textContent).not.toContain(
      'Não foi possível carregar os produtos'
    );
  });

  it('deve tratar erro ao mover produto para a lixeira', () => {
    component.selecionarProdutoParaExcluir(produto);

    component.confirmarExclusao();

    const requisicao = httpMock.expectOne(`${apiUrl}/52`);

    expect(requisicao.request.method).toBe('DELETE');
    expect(component.excluindo()).toBe(true);

    requisicao.flush('Erro interno', {
      status: 500,
      statusText: 'Internal Server Error'
    });

    expect(component.excluindo()).toBe(false);
    expect(component.erroExclusao()).toContain(
      'Não foi possível mover o produto'
    );

    expect(component.produtoParaExcluir()?.id).toBe(52);
  })

  it('deve limpar o total quando o preço tiver mais de duas casas decimais', () => {

    component.formEdicao.controls.preco.setValue('5');
    component.formEdicao.controls.quantidade.setValue('10');

    expect(component.formEdicao.controls.total.value).toBe('50,00');

    const input = document.createElement('input');
    input.value = '5,000000';

    component.formatarPreco({
      target: input
    } as unknown as Event);

    expect(component.formEdicao.controls.preco.invalid).toBe(true);

    expect(component.formEdicao.controls.total.value).toBe('');

    expect(component.formEdicao.invalid).toBe(true);
  });

});
