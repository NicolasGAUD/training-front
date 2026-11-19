export type AvailabilityStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

/** Données envoyées à DummyJSON pour ajouter un produit. */
export type NewProduct = {
  title: string;
  price: number;
  stock: number;
  category: string;
  description: string;
};

/** Catégories proposées dans le formulaire d'ajout (slugs DummyJSON). */
export const PRODUCT_CATEGORIES: readonly string[] = [
  'beauty',
  'fragrances',
  'furniture',
  'groceries',
  'home-decoration',
  'kitchen-accessories',
  'laptops',
  'mens-shirts',
  'mens-shoes',
  'mens-watches',
  'mobile-accessories',
  'motorcycle',
  'skin-care',
  'smartphones',
  'sports-accessories',
  'sunglasses',
  'tablets',
  'tops',
  'vehicle',
  'womens-bags',
  'womens-dresses',
  'womens-jewellery',
  'womens-shoes',
  'womens-watches',
];

export type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  stock: number;
  availabilityStatus: AvailabilityStatus;
  description: string;
  category: string;
  rating: number;
};
