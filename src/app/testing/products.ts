import { Product } from '../models/product';

/** Produits de test (au format de l'application). */
export const testProducts: Product[] = [
  {
    id: 1,
    title: 'Essence Mascara Lash Princess',
    price: 9.99,
    thumbnail:
      'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
    stock: 99,
    availabilityStatus: 'In Stock',
    description: 'Mascara volumisant.',
    category: 'beauty',
    rating: 4.9,
  },
  {
    id: 15,
    title: 'Wooden Bathroom Sink With Mirror',
    price: 1799.99,
    thumbnail:
      'https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp',
    stock: 7,
    availabilityStatus: 'Low Stock',
    description: 'Lavabo en bois.',
    category: 'furniture',
    rating: 4.2,
  },
  {
    id: 153,
    title: 'Volleyball',
    price: 11.99,
    thumbnail:
      'https://cdn.dummyjson.com/product-images/sports-accessories/volleyball/thumbnail.webp',
    stock: 0,
    availabilityStatus: 'Out of Stock',
    description: 'Ballon de volley.',
    category: 'sports-accessories',
    rating: 3.8,
  },
];

/** Corps JSON au format DummyJSON pour la liste (pour HttpTestingController). */
export function dummyJsonListBody(): object {
  return { products: testProducts, total: testProducts.length, skip: 0, limit: 30 };
}
