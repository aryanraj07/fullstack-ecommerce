export interface Rating {
  rate: number;
  count: number;
}
export interface Product {
  id: string;
  title: string;
  category: string;
  rating: Rating;
  price: number;
  image: string;
  description: string;
}
