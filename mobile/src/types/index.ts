/** Product displayed in the shop grid and detail screen */
export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  image: string;
  isFavorite: boolean;
  /** Additional images shown in the product detail gallery */
  gallery?: string[];
  /** Available color hex codes */
  colors?: string[];
  /** Available size options */
  sizes?: string[];
  /** Full product description */
  description?: string;
  /** Category slug this product belongs to */
  category?: string;
}

/** Category chip shown on the home screen */
export interface Category {
  id: string;
  name: string;
  slug: string;
}

/** Promotional banner data */
export interface Banner {
  title: string;
  buttonText: string;
  backgroundImage: string;
  modelImages: string[];
}
