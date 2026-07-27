import { Product } from "./products";

export interface CartProduct extends Product {
  quantity: number;
}
