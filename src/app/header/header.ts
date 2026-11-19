import { Component, computed, inject, signal } from '@angular/core';
import { Cart } from '../cart/cart';

@Component({
  imports: [],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  private readonly cart = inject(Cart);
  shipping = signal('Calcul des frais de port…'); // un signal, avec sa valeur de départ
  constructor() {
    setTimeout(() => {
      this.shipping.set('Livraison offerte'); // nouvelle valeur : les composants qui l'affichent sont prévenus
    }, 2000);
  }

  count = computed(() => this.cart.items().length); // se recalcule quand le panier change
  total = computed(() => this.cart.items().reduce((sum, product) => sum + product.price, 0));

  onClear(): void {
    this.cart.clear();
  }
}
