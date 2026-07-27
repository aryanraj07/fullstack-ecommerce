import type { RouterOutputs, RouterInputs } from "@repo/api-types";

export type User = RouterOutputs["users"]["me"];
export type ProductsOutput = RouterOutputs["products"]["getAllProducts"];
export type ProductItem =
  RouterOutputs["products"]["getSingleProduct"]["product"];
export type WishlistItem = RouterOutputs["wishlistItems"]["getWishlist"];
export type ReviewItem = NonNullable<
  RouterOutputs["products"]["getSingleProduct"]["product"]["reviews"]
>[number];
export type MeOutput = RouterOutputs["users"]["me"];
export type TagItem = NonNullable<
  RouterOutputs["products"]["getSingleProduct"]["product"]["tags"]
>[number];
export type ProductPreview = NonNullable<
  RouterOutputs["products"]["getAllProducts"]["products"]
>[number];

// cart
export type CartOutput = RouterOutputs["cartItem"]["getCart"];
export type CartItem = NonNullable<
  RouterOutputs["cartItem"]["getCart"]["cartItem"]
>[number];
export type CartItems = RouterOutputs["cartItem"]["getCart"];
export type CartSummary = RouterOutputs["cartItem"]["getCartSummary"];
export type CheckoutOutput = RouterOutputs["order"]["checkout"];

export type AddToCartInput = RouterInputs["cartItem"]["addToCart"];
export type UpdateCartInput = RouterInputs["cartItem"]["updateQuantity"];
export type RemoveCartInput = RouterInputs["cartItem"]["removeFromCart"];
export type AddToWishlist = RouterInputs["wishlistItems"]["addToWishlist"];
export type RemoveWishlist =
  RouterInputs["wishlistItems"]["removeFromWishList"];
export type SummaryType = RouterOutputs["cartItem"]["getCartSummary"];
export type FilterDataOutput = RouterOutputs["filters"]["getFilterData"];
export type OrdersOutput = RouterOutputs["order"]["getMyOrders"];

export type OrderItemItem = NonNullable<
  RouterOutputs["order"]["getMyOrders"]
>[number];

// login
export type UsersendOtpInput = RouterInputs["users"]["sendOtp"];
export type UserVerifyOtpInput = RouterInputs["users"]["verifyOtp"];
export type SendOtpOutput = RouterOutputs["users"]["sendOtp"];
export type VerifyOtpOutput = RouterOutputs["users"]["verifyOtp"];
// order
export type OrderbyIdOutput = RouterOutputs["order"]["getOrdderById"];

export type OrderItem = NonNullable<
  RouterOutputs["order"]["getMyOrders"]
>[number];
export type OrderItemItems = NonNullable<
  RouterOutputs["order"]["getMyOrders"]
>[number]["items"][number];
