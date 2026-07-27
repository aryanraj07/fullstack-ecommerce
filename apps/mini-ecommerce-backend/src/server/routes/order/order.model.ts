import { z } from "zod";

/* ---------------------------------- */
/* Order Item Schema */
/* ---------------------------------- */

export const orderItemSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  productId: z.number(),
  quantity: z.number(),
  cartItemId: z.number(),
  price: z.number(), // Decimal -> number
  product: z.object({
    id: z.number(),
    title: z.string(),
    thumbnail: z.string().nullable(),
  }),
});

/* ---------------------------------- */
/* Order Schema */
/* ---------------------------------- */

export const orderSchema = z.object({
  id: z.number(),

  userId: z.number(),
  totalAmount: z.number(), // Decimal -> number
  paymentStatus: z.enum(["PENDING", "SUCCESS", "FAILED"]),
  paymentId: z.string().nullable(),
  orderStatus: z.enum([
    "CREATED",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
  createdAt: z.date(),
  items: z.array(orderItemSchema),
});

/* ---------------------------------- */
/* Responses */
/* ---------------------------------- */

export const myOrdersResponse = z.array(orderSchema);

export const checkoutResponse = z.object({
  orderId: z.number(),
  razorpayOrderId: z.string(),
  amount: z.number(),
  currency: z.string(),
  key: z.string(),
});
