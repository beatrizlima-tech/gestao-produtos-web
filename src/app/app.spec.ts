import { TestBed } from "@angular/core/testing"
import { provideRouter } from "@angular/router"

import {App} from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('deve criar a aplicação', () => {
    const fixture = TestBed.createComponent(App);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve exibir o nome da aplicação na navegação', async () => {
    const fixture = TestBed.createComponent(App);

    await fixture.whenStable();

    const elemento = fixture.nativeElement as HTMLElement;
    const nomeAplicacao = elemento.querySelector('.navbar-brand');

    expect(nomeAplicacao?.textContent).toContain('Gestão de Produtos');
  });
});