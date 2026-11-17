import { NgOptimizedImage } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Product } from '../models/product';

@Component({
  imports: [NgOptimizedImage],
  selector: 'app-product-card',
  styleUrl: './product-card.css',
  templateUrl: './product-card.html',
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly quantity = input.required<number>();
  readonly addedToCart = output<Product>();

  addToCart(): void {
    this.addedToCart.emit(this.product());
  }
}
