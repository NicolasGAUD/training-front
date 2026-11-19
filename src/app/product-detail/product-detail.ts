import { HttpErrorResponse } from '@angular/common/http';
import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { ProductCatalog } from '../catalog/product-catalog';

@Component({
  imports: [NgOptimizedImage],
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  id = input.required<string>(); // le :id de l'adresse, toujours du texte

  private readonly resource = inject(ProductCatalog).productById(() => this.id());

  product = computed(() => (this.resource.hasValue() ? this.resource.value() : undefined));
  loading = this.resource.isLoading;
  notFound = computed(() => {
    const error = this.resource.error();
    return error instanceof HttpErrorResponse && error.status === 404;
  });
  failed = computed(() => this.resource.error() !== undefined && !this.notFound());
}
