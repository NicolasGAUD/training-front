import { AvailabilityStatus, Product } from '../models/product';

/** URL de base unique de l'API DummyJSON. */
export const DUMMYJSON_BASE_URL = 'https://dummyjson.com';

/** Nombre de produits chargés pour la liste. */
export const PRODUCTS_LIMIT = 30;

/** Champs demandés à l'API (le paramètre `select` allège la réponse). */
export const PRODUCT_FIELDS = [
  'id',
  'title',
  'price',
  'thumbnail',
  'stock',
  'availabilityStatus',
  'description',
  'category',
  'rating',
];

/** Forme d'un produit telle que renvoyée par DummyJSON (champs utilisés). */
export type DummyJsonProduct = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  stock: number;
  availabilityStatus?: string;
  description: string;
  category: string;
  rating: number;
};

export type DummyJsonProductList = {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
};

/** Seuil en dessous duquel un stock restant est considéré comme faible. */
export const LOW_STOCK_THRESHOLD = 10;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isDummyJsonProduct(value: unknown): value is DummyJsonProduct {
  return (
    isRecord(value) &&
    typeof value['id'] === 'number' &&
    typeof value['title'] === 'string' &&
    typeof value['price'] === 'number' &&
    typeof value['thumbnail'] === 'string' &&
    typeof value['stock'] === 'number' &&
    typeof value['description'] === 'string' &&
    typeof value['category'] === 'string' &&
    typeof value['rating'] === 'number' &&
    (value['availabilityStatus'] === undefined || typeof value['availabilityStatus'] === 'string')
  );
}

export function isDummyJsonProductList(value: unknown): value is DummyJsonProductList {
  return (
    isRecord(value) &&
    Array.isArray(value['products']) &&
    value['products'].every(isDummyJsonProduct) &&
    typeof value['total'] === 'number' &&
    typeof value['skip'] === 'number' &&
    typeof value['limit'] === 'number'
  );
}

function isAvailabilityStatus(value: string | undefined): value is AvailabilityStatus {
  return value === 'In Stock' || value === 'Low Stock' || value === 'Out of Stock';
}

/**
 * Statut de disponibilité : celui de l'API s'il est connu, sinon dérivé du stock
 * (0 = rupture, moins de LOW_STOCK_THRESHOLD = stock faible, sinon en stock).
 */
export function deriveAvailability(stock: number, status?: string): AvailabilityStatus {
  if (isAvailabilityStatus(status)) {
    return status;
  }
  if (stock <= 0) {
    return 'Out of Stock';
  }
  return stock < LOW_STOCK_THRESHOLD ? 'Low Stock' : 'In Stock';
}

export function toProduct(dto: DummyJsonProduct): Product {
  return {
    id: dto.id,
    title: dto.title,
    price: dto.price,
    thumbnail: dto.thumbnail,
    stock: dto.stock,
    availabilityStatus: deriveAvailability(dto.stock, dto.availabilityStatus),
    description: dto.description,
    category: dto.category,
    rating: dto.rating,
  };
}

/** Valide (type guard) puis convertit la réponse brute de la liste. */
export function parseProductList(raw: unknown): Product[] {
  if (!isDummyJsonProductList(raw)) {
    throw new Error('Réponse DummyJSON invalide : liste de produits attendue');
  }
  return raw.products.map(toProduct);
}

/** Valide (type guard) puis convertit la réponse brute d'un produit. */
export function parseProduct(raw: unknown): Product {
  if (!isDummyJsonProduct(raw)) {
    throw new Error('Réponse DummyJSON invalide : produit attendu');
  }
  return toProduct(raw);
}
