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

/* ------------------------------------------------------------------ */
/*  Product catalogue                                                  */
/* ------------------------------------------------------------------ */

const DEFAULT_HOODIE_COLORS = ['#2D2D2D', '#556B2F', '#9CA3AF', '#C4B5A0'];
const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

/** Featured products shown on the Home "Top Sellers" grid */
export const PRODUCTS: Product[] = [
  {
    id: '1',
    brand: 'The North-face',
    name: 'Oversized Hoodie',
    price: 145.99,
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
    isFavorite: false,
    category: 'hoodies',
    gallery: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    ],
    colors: DEFAULT_HOODIE_COLORS,
    sizes: DEFAULT_SIZES,
    description:
      'Introducing our Regular Fit hoodie, designed for an ultimate comfort and style. Made from soft, comfy breathable fabric, this hoodie features a classic fabric that is perfect for layering or wearing on its own.',
  },
  {
    id: '2',
    brand: 'The North-face',
    name: 'Simple Dome Hoodie',
    price: 189.5,
    image:
      'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=400&h=500&fit=crop',
    isFavorite: false,
    category: 'hoodies',
    gallery: [
      'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    ],
    colors: DEFAULT_HOODIE_COLORS,
    sizes: DEFAULT_SIZES,
    description:
      'The Simple Dome Hoodie delivers everyday warmth with a clean, minimal silhouette. Crafted from heavyweight cotton fleece for all-day comfort.',
  },
  {
    id: '3',
    brand: 'Nike',
    name: 'Club Fleece Hoodie',
    price: 119.99,
    image:
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop',
    isFavorite: false,
    category: 'hoodies',
    colors: DEFAULT_HOODIE_COLORS,
    sizes: DEFAULT_SIZES,
    description:
      'Nike Club Fleece keeps it classic with a relaxed fit and soft fleece fabric. An embroidered Swoosh logo adds a signature finish.',
  },
  {
    id: '4',
    brand: 'Adidas',
    name: 'Essential Hoodie',
    price: 99.99,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    isFavorite: false,
    category: 'hoodies',
    colors: DEFAULT_HOODIE_COLORS,
    sizes: DEFAULT_SIZES,
    description:
      'Built for comfort on the go, the Essentials Hoodie pairs a kangaroo pocket with a lined drawcord hood for everyday warmth.',
  },
];

/** Products shown on the Search screen (Jackets category) */
export const SEARCH_PRODUCTS: Product[] = [
  {
    id: '10',
    brand: 'The North-face',
    name: 'Quest Insulated Jacket',
    price: 159.75,
    image:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop',
    isFavorite: false,
    category: 'jackets',
    colors: ['#C4A97D', '#2D2D2D', '#556B2F'],
    sizes: DEFAULT_SIZES,
    description:
      'Stay warm and dry on the trail with the Quest Insulated Jacket. Heatseeker™ insulation pairs with a DryVent™ waterproof shell to keep you protected in changing conditions.',
  },
  {
    id: '11',
    brand: 'The North-face',
    name: 'Canyonlands Jacket',
    price: 175.0,
    image:
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=500&fit=crop',
    isFavorite: false,
    category: 'jackets',
    colors: ['#1B2A4A', '#2D2D2D', '#9CA3AF'],
    sizes: DEFAULT_SIZES,
    description:
      'The Canyonlands Full-Zip jacket is made with soft, midweight fleece that delivers reliable warmth for cool-weather adventures.',
  },
  {
    id: '12',
    brand: 'The North-face',
    name: 'Carto Mono Jacket',
    price: 169.67,
    image:
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop',
    isFavorite: false,
    category: 'jackets',
    colors: ['#556B2F', '#2D2D2D'],
    sizes: DEFAULT_SIZES,
    description:
      'An all-season triclimate jacket with a removable inner layer, giving you three options in one versatile piece.',
  },
  {
    id: '13',
    brand: 'The North-face',
    name: 'Packable Jacket',
    price: 169.67,
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop',
    isFavorite: false,
    category: 'jackets',
    colors: ['#9CA3AF', '#2D2D2D'],
    sizes: DEFAULT_SIZES,
    description:
      'Ultralight and extremely packable, this jacket stows into its own pocket so you can carry it anywhere.',
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

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Look up any product by id across all catalogues */
export function getProductById(id: string): Product | undefined {
  return [...PRODUCTS, ...SEARCH_PRODUCTS].find((p) => p.id === id);
}
