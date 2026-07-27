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
      let total = 0;
      const order = await ctx.prisma.$transaction(async (tx) => {
        const cartItems = await tx.cartItem.findMany({
          where: { userId: ctx.user.id, id: { in: input.cartItemsIds } },
          include: { product: true },
        });

        if (cartItems.length === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cart is empty",
          });
        }

        for (const item of cartItems) {
          if (item.product.stock < item.quantity) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `${item.product.title} out of stock`,
            });
          }

          const price = Number(item.product.price);
          const discountPercentage = item.product.discountPercentage ?? 0;

          const discountedPrice = price - (price * discountPercentage) / 100;

          total += discountedPrice * item.quantity;

          total += price * item.quantity;
        }

        return tx.order.create({
          data: {
            userId: ctx.user.id,
            totalAmount: total,
            paymentStatus: "PENDING",
            orderStatus: "CREATED",

            items: {
              create: cartItems.map((item) => {
                const price = Number(item.product.price);
                const discountPercentage = item.product.discountPercentage ?? 0;

                const discountedPrice =
                  price - (price * discountPercentage) / 100;
                return {
                  productId: item.productId,
                  cartItemId: item.id,
                  quantity: item.quantity,
                  price: discountedPrice,
                };
              }),
            },
          },
        });
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
});
