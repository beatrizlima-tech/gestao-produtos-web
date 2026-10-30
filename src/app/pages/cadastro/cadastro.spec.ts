import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cadastro } from './cadastro';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('Cadastro', () => {
  let component: Cadastro;
  let fixture: ComponentFixture<Cadastro>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cadastro],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Cadastro);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('não deve cadastrar um produto com dados inválidos', () => {
    component.cadastrar();

    expect(component.formulario.invalid).toBe(true);
    expect(component.formulario.controls.nome.touched).toBe(true);
    expect(component.salvando()).toBe(false);
  });

  it('deve tratar um erro da API durante o cadastro', () => {
    component.formulario.setValue({
      nome: 'Mouse sem fio',
      descricao: 'Mouse USB',
      preco: 89.90,
      quantidade: 5
    });

    component.cadastrar();

    const requisicao = httpMock.expectOne(
      'http://localhost:8081/api/v1/produtos'
    );

    expect(requisicao.request.method).toBe('POST');
    expect(requisicao.request.body).toEqual({
      nome: 'Mouse sem fio',
      descricao: 'Mouse USB',
      preco: 89.90,
      quantidade: 5
    });

    requisicao.flush('Erro interno', {
      status: 500,
      statusText: 'Internal Server Error'
    });

    expect(component.salvando()).toBe(false);
    expect(component.mensagemErro()).toContain(
      'Não foi possível cadastrar'
    );
  });
});