import { Component, input, output } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../models/product';
import { catalog } from '../catalog';

@Component({
  imports: [ProductCard],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList {
  products: Product[] = catalog;
  visibleProducts: Product[] = catalog;
  readonly cart = input.required<Product[]>();
  readonly addToCart = output<Product>();

  onAddedToCart(product: Product): void {
    this.addToCart.emit(product);
  }

  quantityOf(product: Product): number {
    return this.cart().filter((item) => item.id === product.id).length;
  }

  showAll(): void {
    this.visibleProducts = this.products;
  }

  showInStock(): void {
    this.visibleProducts = this.products.filter((product) => product.stock > 0);
  }

  showLuxury(): void {
    this.visibleProducts = this.products.filter((product) => product.price > 1000);
  }
}
