import { ComponentFixture, TestBed } from "@angular/core/testing";

import  {Dashboard } from './dashboard';
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter ([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve carregar produtos e calcular os indicadores', () => {
    fixture.detectChanges();

    const requisicao = httpMock.expectOne(
      '/api/v1/produtos'
    );

    expect(requisicao.request.method).toBe('GET');

    requisicao.flush([
      {
        id: 1,
        nome: 'Mouse',
        preco: 50,
        quantidade: 2,
        total: 100
      },
      {
        id: 2,
        nome: 'Teclado',
        preco: 83.33,
        quantidade: 3,
        total: 250
      }
    ]);

    fixture.detectChanges();

    expect(component.totalProdutos()).toBe(2);
    expect(component.totalUnidades()).toBe(5);
    expect(component.valorEstoque()).toBe(350);
    expect(component.carregando()).toBe(false);
    expect(component.erro()).toBe(false);
  });

  it('deve informar quando a API falhar', () => {
    fixture.detectChanges();

    const requisicao = httpMock.expectOne(
      '/api/v1/produtos'
    );

    requisicao.flush('Erro no servidor', {
      status: 500,
      statusText: 'Internal Server Error'
    });

    fixture.detectChanges();

    expect(component.erro()).toBe(true);
    expect(component.carregando()).toBe(false);
  });
});