import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NewProduct, Product } from '../models/product';
import {
  DUMMYJSON_BASE_URL,
  PRODUCT_FIELDS,
  PRODUCTS_LIMIT,
  parseAddedProduct,
  parseProduct,
  parseProductList,
} from './dummyjson';

@Service()
export class ProductCatalog {
  private readonly http = inject(HttpClient);

  /** Liste des produits : value(), isLoading(), error(). */
  readonly products: HttpResourceRef<Product[] | undefined> = httpResource(
    () =>
      `${DUMMYJSON_BASE_URL}/products?limit=${PRODUCTS_LIMIT}&select=${PRODUCT_FIELDS.join(',')}`,
    { parse: parseProductList },
  );

  /**
   * Ajoute un produit (simulé par DummyJSON : un id est renvoyé, rien n'est enregistré).
   * La réponse est validée par un type guard ; une réponse invalide rejette la promesse.
   */
  async addProduct(newProduct: NewProduct): Promise<Product> {
    const raw: unknown = await firstValueFrom(
      this.http.post(`${DUMMYJSON_BASE_URL}/products/add`, newProduct, {
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    return parseAddedProduct(raw);
  }

  /**
   * Ressource d'un produit selon un id réactif. À appeler dans un contexte
   * d'injection (initialiseur de champ). Un id undefined laisse la ressource inactive.
   */
  productById(id: () => string | undefined): HttpResourceRef<Product | undefined> {
    return httpResource(
      () => {
        const value = id();
        return value === undefined
          ? undefined
          : `${DUMMYJSON_BASE_URL}/products/${encodeURIComponent(value)}`;
      },
      { parse: parseProduct },
    );
  }
}
