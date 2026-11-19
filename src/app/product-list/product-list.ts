import { Component, computed, inject, signal } from '@angular/core';
import { CartService } from '../cart.service';
import { ProductCatalog } from '../catalog/product-catalog';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../models/product';

type Filter = 'all' | 'inStock' | 'luxury';

@Component({
  imports: [ProductCard],
  selector: 'app-product-list',
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductList {
  private readonly catalog = inject(ProductCatalog);
  private readonly cart = inject(CartService);
  private readonly filter = signal<Filter>('all');

  readonly loading = this.catalog.products.isLoading;
  readonly failed = computed(() => this.catalog.products.error() !== undefined);
  readonly products = computed<Product[]>(() =>
    this.catalog.products.hasValue() ? (this.catalog.products.value() ?? []) : [],
  );
  readonly visibleProducts = computed(() => {
    switch (this.filter()) {
      case 'inStock':
        return this.products().filter((product) => product.stock > 0);
      case 'luxury':
        return this.products().filter((product) => product.price > 1000);
      default:
        return this.products();
    }
  });

  constructor() {
    this.catalog.loadProducts();
  }

  onAddedToCart(product: Product): void {
    this.cart.add(product);
  }

  quantityOf(product: Product): number {
    return this.cart.quantityOf(product);
  }

  showAll(): void {
    this.filter.set('all');
  }

  showInStock(): void {
    this.filter.set('inStock');
  }

  showLuxury(): void {
    this.filter.set('luxury');
  }
}
