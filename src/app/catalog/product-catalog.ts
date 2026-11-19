import { httpResource, HttpResourceRef } from '@angular/common/http';
import { Service } from '@angular/core';
import { Product } from '../models/product';
import {
  DUMMYJSON_BASE_URL,
  PRODUCT_FIELDS,
  PRODUCTS_LIMIT,
  parseProduct,
  parseProductList,
} from './dummyjson';

@Service()
export class ProductCatalog {
  /** Liste des produits : value(), isLoading(), error(). */
  readonly products: HttpResourceRef<Product[] | undefined> = httpResource(
    () =>
      `${DUMMYJSON_BASE_URL}/products?limit=${PRODUCTS_LIMIT}&select=${PRODUCT_FIELDS.join(',')}`,
    { parse: parseProductList },
  );

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
