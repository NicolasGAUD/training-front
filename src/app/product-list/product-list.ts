import { Component, signal } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { catalog, Product } from '../products';

@Component({
  imports: [ProductCard],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList {
  products: Product[] = catalog;
  visibleProducts: Product[] = catalog;
  readonly cartCount = signal(0);

  onAddedToCart(): void {
    this.cartCount.update((c) => c + 1);
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
