import { Component, input, output, signal } from '@angular/core';
import { Product } from '../models/product';

@Component({
  imports: [],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  cart = input.required<Product[]>(); // remplace count
  clear = output<void>(); // void : l'événement ne transporte rien
  shipping = signal('Calcul des frais de port…'); // un signal, avec sa valeur de départ
  constructor() {
    setTimeout(() => {
      this.shipping.set('Livraison offerte'); // nouvelle valeur : les composants qui l'affichent sont prévenus
    }, 2000);
  }
}
