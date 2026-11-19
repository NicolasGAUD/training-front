import { Service, computed, signal } from '@angular/core';
import { Product } from './models/product';

@Service()
export class CartService {
  private readonly _items = signal<Product[]>([]); // le panier : seul le service y touche
  readonly items = this._items.asReadonly(); // les autres le lisent, sans pouvoir le modifier

  readonly count = computed(() => this.items().length);
  readonly total = computed(() => this.items().reduce((sum, product) => sum + product.price, 0));

  add(product: Product): void {
    this._items.update((items) => [...items, product]); // un nouveau tableau, comme toujours
  }

  clear(): void {
    this._items.set([]);
  }

  quantityOf(product: Product): number {
    return this.items().filter((item) => item.id === product.id).length;
  }
}
