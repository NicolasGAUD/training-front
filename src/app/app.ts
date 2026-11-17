import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { ProductList } from './product-list/product-list';

@Component({
  imports: [Header, ProductList, RouterOutlet], // App utilise Header et ProductList (ProductCard est utilisé par ProductList)
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('training-front');
}
