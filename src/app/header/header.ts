import { Component, inject, signal } from '@angular/core';
import { Auth } from '../auth/auth';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  private readonly cart = inject(CartService);
  protected readonly auth = inject(Auth);
  shipping = signal('Calcul des frais de port…'); // un signal, avec sa valeur de départ
  constructor() {
    setTimeout(() => {
      this.shipping.set('Livraison offerte'); // nouvelle valeur : les composants qui l'affichent sont prévenus
    }, 2000);
  }

  count = this.cart.count; // calculé par le service, partagé avec toute l'appli
  total = this.cart.total;

  onClear(): void {
    this.cart.clear();
  }
}
