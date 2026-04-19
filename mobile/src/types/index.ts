/** Product displayed in the shop grid */
export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  image: string;
  isFavorite: boolean;
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
