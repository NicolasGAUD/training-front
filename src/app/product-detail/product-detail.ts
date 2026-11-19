import { Component, computed, input } from '@angular/core';
import { catalog } from '../catalog';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  id = input.required<string>(); // le :id de l'adresse, toujours du texte

  product = computed(() => catalog.find((p) => p.id === Number(this.id())));
}
