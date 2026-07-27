import z from "zod";
import { protectedProcedure, publicProcedure, router } from "../../trpc.js";
import { simpleMessageResponse } from "../users/model.js";
import {
  cartItemModel,
  cartSummary,
  getCartItemsOutput,
  type CartItem,
} from "./cart.models.js";

export const cartRouter = router({
  addToCart: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/add-to-cart",
        description: "Add Product to cart",
        tags: ["Product", "Cart"],
      },
    })
    .input(
      z.object({
        productId: z.number(),
        quantity: z.number().min(1).default(1),
      }),
    )
    .output(simpleMessageResponse)
    .mutation(async ({ ctx, input }) => {
      const { productId, quantity } = input;
      console.log(productId);
      console.log(quantity);

      console.log("User id ", ctx?.user?.id);

      if (ctx.user) {
        console.log("Logging in user");

        await ctx.prisma.cartItem.upsert({
          where: {
            userId_productId: {
              userId: ctx.user.id,
              productId,
            },
          },
          update: {
            quantity: { increment: quantity },
          },
          create: {
            userId: ctx.user.id,
            productId,
            quantity,
          },
        });
      } else {
        console.log("Logging in guest");

        await ctx.prisma.cartItem.upsert({
          where: {
            guestId_productId: {
              guestId: ctx.guestId!,
              productId,
            },
          },
          update: {
            quantity: { increment: quantity },
          },
          create: {
            guestId: ctx.guestId!,
            productId,
            quantity,
          },
        });
      }

      return { message: "Added to Cart" };
    }),
  getCart: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/cart",
        description: "Get cart products",
        tags: ["Product", "Cart"],
      },
    })
    .output(getCartItemsOutput)
    .query(async ({ ctx }) => {
      const whereCondition = ctx.user
        ? { userId: ctx.user.id }
        : { guestId: ctx.guestId! };

      const cart = await ctx.prisma.cartItem.findMany({
        where: whereCondition,
        include: {
          product: {
            select: {
              id: true,
              title: true,
              price: true,
              discountPercentage: true,
              thumbnail: true,
              stock: true,
              rating: true,
              brand: {
                select: { name: true },
              },
            },
          },
        },
      });

      let total = 0;
      let discount = 0;
      type CartWithProduct = (typeof cart)[number];
      const items = cart.map((item: CartWithProduct) => {
        const price = Number(item.product.price);
        const discountPercentage = item.product.discountPercentage ?? 0;

        const discountedPrice = Number(
          (price * (1 - discountPercentage / 100)).toFixed(2),
        );
        total += price * item.quantity;

        if (discountPercentage) {
          discount += ((price * discountPercentage) / 100) * item.quantity;
        }

        return {
          id: item.id,
          productId: item.product.id,
          quantity: item.quantity,
          title: item.product.title,
          price: price,
          discountPercentage: discountPercentage,
          discountedPrice: discountedPrice,
          thumbnail: item.product.thumbnail ?? "",
          stock: item.product.stock,
          rating: item.product.rating ?? 0,
          brandName: item.product.brand?.name ?? "",
        };
      });

      return {
        cartItem: items,
        summary: {
          total,
          discount,
          payable: total - discount,
        },
      };
    }),
  getCartSummary: publicProcedure
    .input(
      z.object({
        cartItemIds: z.array(z.number()),
      }),
    )
    .output(cartSummary)
    .query(async ({ ctx, input }) => {
      const whereCondition = ctx.user
        ? { userId: ctx.user.id }
        : { guestId: ctx.guestId! };

      const cartItems = await ctx.prisma.cartItem.findMany({
        where: {
          ...whereCondition,
          id: { in: input.cartItemIds },
        },
        include: {
          product: true,
        },
      });

      let total: number = 0;
      let discount = 0;
      type CartWithProduct = (typeof cartItems)[number];
      cartItems.forEach((item: CartWithProduct) => {
        const price = Number(item.product.price);
        if (item.product.discountPercentage) {
        }

        total += price * item.quantity;

        if (item.product.discountPercentage) {
          discount +=
            ((Number(item.product.price) * item.product.discountPercentage) /
              100) *
            item.quantity;
        }
      });

      return {
        total,
        discount,
        payable: total - discount,
      };
    }),

  removeFromCart: publicProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/cart/{cartItemId}",
        description: "Remove from cart",
        tags: ["Product", "Cart"],
      },
    })
    .input(z.object({ cartItemId: z.number() }))
    .output(simpleMessageResponse)
    .mutation(async ({ ctx, input }) => {
      const whereCondition = ctx.user
        ? { userId: ctx.user.id, id: input.cartItemId }
        : { guestId: ctx.guestId!, id: input.cartItemId };

      await ctx.prisma.cartItem.deleteMany({
        where: whereCondition,
      });

      return { message: "Removed from cart" };
    }),
  updateQuantity: publicProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/cart/{cartItemId}",
        description: "Update cart item",
        tags: ["Product", "Cart"],
      },
    })
    .input(
      z.object({
        cartItemId: z.number(),
        quantity: z.number().min(1).default(1),
      }),
    )
    .output(simpleMessageResponse)
    .mutation(async ({ ctx, input }) => {
      const whereCondition = ctx.user
        ? { userId: ctx.user.id, id: input.cartItemId }
        : { guestId: ctx.guestId!, id: input.cartItemId };

      await ctx.prisma.cartItem.updateMany({
        where: whereCondition,
        data: {
          quantity: input.quantity,
        },
      });

      return { message: "Quantity updated" };
    }),
  mergeCart: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/merge-cart",
        description: " cart",
        tags: ["Product", "Cart"],
      },
    })
    .output(simpleMessageResponse)
    .mutation(async ({ ctx }) => {
      const guestId = ctx.guestId;
      if (!guestId) {
        return { message: "No guest cart to merge" };
      }

      const guestItems = await ctx.prisma.cartItem.findMany({
        where: { guestId },
      });

      if (guestItems.length === 0) {
        return { message: "Guest cart empty" };
      }

      await ctx.prisma.$transaction(
        guestItems.map((item) =>
          ctx.prisma.cartItem.upsert({
            where: {
              userId_productId: {
                userId: ctx.user.id,
                productId: item.productId,
              },
            },
            update: {
              quantity: { increment: item.quantity },
            },
            create: {
              userId: ctx.user.id,
              productId: item.productId,
              quantity: item.quantity,
            },
          }),
        ),
      );

      // Delete guest cart once
      await ctx.prisma.cartItem.deleteMany({
        where: { guestId },
      });

      ctx.res.clearCookie("guestId");
      //
      return { message: "Merged cart successfully" };
    }),
});
