import { Component, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { ProductList } from './product-list/product-list';
import { Product } from './models/product';

@Component({
  imports: [Header, ProductList, RouterOutlet], // App utilise Header et ProductList (ProductCard est utilisé par ProductList)
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  readonly cart = signal<Product[]>([]);

  constructor() {
    effect(() => {
      console.log('Le panier a changé :', this.cart().length, 'article(s)'); // une ligne par changement
    });
  }

  onAdd(product: Product): void {
    this.cart.update((cart) => [...cart, product]); // un nouveau tableau : l'ancien + ce produit
  }

  onClear(): void {
    this.cart.set([]);
  }
}
