import type { Product, Category, Banner } from '@/types';

/**
 * Onboarding collage images — 3 columns of fashion model photos.
 * Will be replaced with curated brand imagery later.
 */
export const ONBOARDING_COLUMNS: string[][] = [
  [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop',
  ],
  [
    'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544441893-675973e31985?w=300&h=400&fit=crop',
  ],
  [
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&h=400&fit=crop',
  ],
];

/** Shop categories for the horizontal chip list */
export const CATEGORIES: Category[] = [
  { id: '1', name: 'Hoodies', slug: 'hoodies' },
  { id: '2', name: 'Jackets', slug: 'jackets' },
  { id: '3', name: 'Jeans', slug: 'jeans' },
  { id: '4', name: 'T-Shirts', slug: 't-shirts' },
  { id: '5', name: 'Shoes', slug: 'shoes' },
  { id: '6', name: 'Accessories', slug: 'accessories' },
];

/** Featured products for the "Top Sellers" grid */
export const PRODUCTS: Product[] = [
  {
    id: '1',
    brand: 'The North-face',
    name: 'Oversized Hoodie',
    price: 145.99,
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
    isFavorite: false,
  },
  {
    id: '2',
    brand: 'The North-face',
    name: 'Simple Dome Hoodie',
    price: 189.5,
    image:
      'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=400&h=500&fit=crop',
    isFavorite: false,
  },
  {
    id: '3',
    brand: 'Nike',
    name: 'Club Fleece Hoodie',
    price: 119.99,
    image:
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop',
    isFavorite: false,
  },
  {
    id: '4',
    brand: 'Adidas',
    name: 'Essential Hoodie',
    price: 99.99,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    isFavorite: false,
  },
];

/** Home-screen promo banner */
export const BANNER: Banner = {
  title: 'Winter Flash Sale\nup-to 40%',
  buttonText: 'Explore Now',
  backgroundImage:
    'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&h=400&fit=crop',
  modelImages: [
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=200&h=300&fit=crop',
    'https://images.unsplash.com/photo-1544441893-675973e31985?w=200&h=300&fit=crop',
  ],
};
