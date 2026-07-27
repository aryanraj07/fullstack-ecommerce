import { router } from "./trpc.js";
import { productRouter } from "./routes/product/product.routes.js";
import { filterRouter } from "./routes/filters/filters.routes.js";
import { userRouter } from "./routes/users/users.route.js";
import { wishListRouter } from "./routes/wishlist/wishlist.routes.js";
import { cartRouter } from "./routes/cart/cart.routes.js";
import { orderRouter } from "./routes/order/order.routes.js";
// root router
export const appRouter = router({
  products: productRouter,
  filters: filterRouter,
  users: userRouter,
  wishlistItems: wishListRouter,
  cartItem: cartRouter,
  order: orderRouter,
});
// This type will later used by frontend
export type AppRouter = typeof appRouter;
