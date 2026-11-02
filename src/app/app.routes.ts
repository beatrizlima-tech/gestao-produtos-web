
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'produtos',
    loadComponent: () =>
      import('./pages/produtos/produtos').then(m => m.Produtos)
  },
  {
    path: 'produtos/novo',
    loadComponent: () =>
      import('./pages/cadastro/cadastro').then(m => m.Cadastro)
  },
  {
    path: 'lixeira',
    loadComponent: () =>
      import('./pages/lixeira/lixeira').then(m => m.Lixeira)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
