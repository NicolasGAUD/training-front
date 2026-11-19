import { Component, inject } from '@angular/core';
import { Cart } from '../cart/cart';
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
  private readonly cart = inject(Cart);

  onAddedToCart(product: Product): void {
    this.cart.add(product);
  }

  quantityOf(product: Product): number {
    return this.cart.items().filter((item) => item.id === product.id).length;
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
