export type AvailabilityStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

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
