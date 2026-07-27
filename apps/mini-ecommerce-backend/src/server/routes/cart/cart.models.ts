import z, { number } from "zod";
import { productModel } from "../product/models.js";

export const cartSummary = z.object({
  total: z.number(),
  discount: z.number(),
  payable: z.number(),
});
export const cartItemModel = z.object({
  id: z.number(),
  quantity: z.number().int().min(1),
  productId: z.number(),
  title: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  discountedPrice: z.number().optional(),
  thumbnail: z.string(),
  stock: z.number(),
  rating: z.number(),
  brandName: z.string(),
});

export type CartItem = z.infer<typeof cartItemModel>;
export const getCartItemsOutput = z.object({
  cartItem: z.array(cartItemModel),
});
