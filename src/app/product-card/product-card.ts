import { NgOptimizedImage } from '@angular/common';
import { booleanAttribute, Component, input, output } from '@angular/core';
import { Product } from '../models/product';
import { RouterLink } from '@angular/router';

@Component({
  imports: [NgOptimizedImage, RouterLink],
  selector: 'app-product-card',
  styleUrl: './product-card.css',
  templateUrl: './product-card.html',
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly quantity = input.required<number>();
  readonly priority = input(false, { transform: booleanAttribute });
  readonly addedToCart = output<Product>();

  addToCart(): void {
    this.addedToCart.emit(this.product());
  }
}
