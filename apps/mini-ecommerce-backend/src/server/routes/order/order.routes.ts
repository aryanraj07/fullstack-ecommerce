import { TRPCError } from "@trpc/server";
import crypto from "crypto";

import { protectedProcedure, router } from "../../trpc.js";
import z from "zod";
import { razorpay } from "../../../lib/razorpay.js";
// import { simpleMessageResponse } from "../users/model.js";
import {
  checkoutResponse,
  myOrdersResponse,
  // orderItemSchema,
  orderSchema,
} from "./order.model.js";
import { Prisma, Product } from "@repo/db/client";
export type OrderItemInput = {
  productId: number;
  quantity: number;
  product: Product;
};
export function validateAndCalculateTotal(items: OrderItemInput[]) {
  if (items.length === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "No items to checkout",
    });
  }

  let total = 0;

  for (const item of items) {
    if (item.product.stock < item.quantity) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `${item.product.title} is out of stock`,
      });
    }

    const price = Number(item.product.price);

    const discount = item.product.discountPercentage ?? 0;

    const discountedPrice = price - (price * discount) / 100;

    total += discountedPrice * item.quantity;
  }

  return total;
}
export async function createOrder(
  tx: Prisma.TransactionClient,
  userId: number,
  total: number,
  items: OrderItemInput[],
) {
  const orderItems: Prisma.OrderItemUncheckedCreateWithoutOrderInput[] =
    items.map((item) => {
      const price = Number(item.product.price);

      const discount = item.product.discountPercentage ?? 0;

      const discountedPrice = price - (price * discount) / 100;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: discountedPrice,
      };
    });
  return tx.order.create({
    data: {
      userId,

      totalAmount: total,

      paymentStatus: "PENDING",

      orderStatus: "CREATED",

      items: {
        create: orderItems,
      },
    },
  });
}
export async function createRazorpayOrder(orderId: number, total: number) {
  return razorpay.orders.create({
    amount: Math.round(total * 100),

    currency: "INR",

    receipt: `order_${orderId}`,
  });
}
export const orderRouter = router({
  checkout: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/orders/checkout",
        tags: ["Order"],
        summary: "Checkout cart",
        description: "Create order and generate Razorpay order",
      },
    })
    .input(z.object({ cartItemsIds: z.array(z.number()) }))
    .output(checkoutResponse)
    .mutation(async ({ ctx, input }) => {
      const { order, total } = await ctx.prisma.$transaction(async (tx) => {
        const cartItems = await tx.cartItem.findMany({
          where: { userId: ctx.user.id, id: { in: input.cartItemsIds } },
          include: { product: true },
        });

        if (!cartItems.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cart is empty",
          });
        }
        const items: OrderItemInput[] = cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          product: item.product,
        }));
        const total = validateAndCalculateTotal(items);
        const order = await createOrder(tx, ctx.user.id, total, items);
        return {
          order,
          total,
        };
      });

      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(total * 100), // convert to paise
        currency: "INR",
        receipt: `order_${order.id}`,
      });

      // Save Razorpay Order ID
      await ctx.prisma.order.update({
        where: { id: order.id },
        data: { paymentId: razorpayOrder.id },
      });
      const key = process.env.RAZORPAY_KEY_ID;

      if (!key) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Razorpay key not configured",
        });
      }
      return {
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: Number(razorpayOrder.amount),
        currency: razorpayOrder.currency,
        key,
      };
    }),
  checkoutBuyNow: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/orders/buy-now",
        tags: ["Order"],
        summary: "Checkout buy now product",
        description: "Create order and generate Razorpay order",
      },
    })
    .input(
      z.object({
        productId: z.number(),
        quantity: z.number().min(1).default(1),
      }),
    )
    .output(checkoutResponse)

    .mutation(async ({ ctx, input }) => {
      const { order, total } = await ctx.prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
          where: {
            id: input.productId,
          },
        });

        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found",
          });
        }

        const items: OrderItemInput[] = [
          {
            productId: product.id,
            quantity: input.quantity,
            product,
          },
        ];

        const total = validateAndCalculateTotal(items);

        const order = await createOrder(tx, ctx.user.id, total, items);

        return {
          order,
          total,
        };
      });

      const razorpayOrder = await createRazorpayOrder(order.id, total);

      await ctx.prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          paymentId: razorpayOrder.id,
        },
      });

      const key = process.env.RAZORPAY_KEY_ID;

      if (!key) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Razorpay key missing",
        });
      }

      return {
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: Number(razorpayOrder.amount),
        currency: razorpayOrder.currency,
        key,
      };
    }),
  getMyOrders: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/orders",
        description: "Get all my orders",
        tags: ["Order"],
      },
    })
    .output(myOrdersResponse)
    .query(async ({ ctx }) => {
      const orders = await ctx.prisma.order.findMany({
        where: { userId: ctx.user.id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  thumbnail: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return orders.map((order) => ({
        ...order,
        totalAmount: order.totalAmount.toNumber(),
        items: order.items.map((item) => ({
          ...item,
          price: Number(item.price),
          product: item.product,
        })),
      }));
    }),

  getOrdderById: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/orders/{orderId}",
        tags: ["Orders"],
        summary: "Get order by ID",
      },
    })
    .input(z.object({ orderId: z.number() }))
    .output(orderSchema)
    .query(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.findFirst({
        where: {
          userId: ctx.user.id,
          id: input.orderId,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }
      return {
        ...order,
        totalAmount: Number(order.totalAmount),
        items: order.items.map((item) => ({
          ...item,
          price: Number(item.price),
          product: item.product,
        })),
      };
    }),
  myOrders: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.order.findMany({
      where: {
        userId: ctx.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }),
  markOrderPaymentFailed: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/orders/cancelPayment",
        tags: ["Orders"],
        summary: "Cancel dismissed payment",
      },
    })
    .input(
      z.object({
        orderId: z.number(),
      }),
    )
    .output(
      z.object({
        success: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.findFirst({
        where: {
          id: input.orderId,
          userId: ctx.user.id,
        },
      });
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }
      // already processed
      if (order.paymentStatus !== "PENDING") {
        return {
          success: false,
        };
      }
      // prisma query for updating order status
      const updated = await ctx.prisma.order.updateMany({
        where: {
          id: input.orderId,
          userId: ctx.user.id,
          paymentStatus: "PENDING",
        },
        data: {
          paymentStatus: "FAILED",
          orderStatus: "CANCELLED",
        },
      });
      return {
        success: updated.count > 0,
      };
    }),
});
