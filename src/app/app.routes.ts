import { Routes } from '@angular/router';
import { Home } from './home/home';
import { NotFound } from './not-found/not-found';
import { ProductDetail } from './product-detail/product-detail';
import { authGuard } from './auth-guard';
import { Account } from './account/account';
export const routes: Routes = [
  { path: '', component: Home }, // l'adresse vide : localhost:4200/
  { path: 'products/:id', component: ProductDetail },
  { path: 'account', component: Account, canActivate: [authGuard] },
  { path: '**', component: NotFound }, // le joker : toutes les autres adresses
];
