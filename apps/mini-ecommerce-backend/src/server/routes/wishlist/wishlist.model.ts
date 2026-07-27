// import z from "zod";
// import { productModel } from "../product/models.js";
// export const wishlistProductModel = productModel.pick({
//   id: true,
//   title: true,
//   price: true,
//   discountPercentage: true,
//   thumbnail: true,
//   stock: true,
// });
// export const wishListModel = z.object({
//   id: z.number().int(),
//   userId: z.number().int(),
//   productId: z.number().int(),
//   product: wishlistProductModel,
// });
// export const getWishListItemsOutput = z.array(wishListModel);
