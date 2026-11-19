import { Service, signal } from '@angular/core';
import { Product } from '../models/product';

@Service()
export class Cart {
  private readonly _items = signal<Product[]>([]);
  readonly items = this._items.asReadonly();

  add(product: Product): void {
    this._items.update((items) => [...items, product]);
  }

  clear(): void {
    this._items.set([]);
  }
}
