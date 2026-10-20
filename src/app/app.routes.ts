
import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { Produtos } from './pages/produtos/produtos';
import { Cadastro } from './pages/cadastro/cadastro';

export const routes: Routes = [
    {
        path: '',
        component: Dashboard
    },
    {
        path: 'produtos',
        component: Produtos
    },
    {
        path: 'produtos/novo',
        component: Cadastro
    },
    {
        path: '**',
        redirectTo: ''
    }
];
