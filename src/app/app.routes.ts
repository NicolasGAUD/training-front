import { Routes } from '@angular/router';
import { Home } from './home/home';
import { NotFound } from './not-found/not-found';
import { ProductDetail } from './product-detail/product-detail';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: Home }, // l'adresse vide : localhost:4200/
  { path: 'products/:id', component: ProductDetail },
  { path: 'login', loadComponent: () => import('./auth/login/login').then((m) => m.Login) },
  {
    path: 'account',
    loadComponent: () => import('./account/account').then((m) => m.Account),
    canActivate: [authGuard],
  },
  { path: '**', component: NotFound }, // le joker : toutes les autres adresses
];
