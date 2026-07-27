import z from "zod";
import { protectedProcedure, publicProcedure, router } from "../../trpc.js";
import { simpleMessageResponse } from "../users/model.js";
import { productPreviewModal } from "../product/models.js";

export const wishListRouter = router({
  addToWishlist: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        tags: ["Wishlist"],
        path: "/wishlist",
        description: "Add product to wishlist",
      },
    })
    .input(
      z.object({
        productId: z.number(),
      }),
    )
    .output(simpleMessageResponse)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user) {
        await ctx.prisma.wishlistItem.upsert({
          where: {
            userId_productId: {
              userId: ctx.user.id,
              productId: input.productId,
            },
          },
          update: {},
          create: {
            userId: ctx.user.id,
            productId: input.productId,
          },
        });
      } else {
        await ctx.prisma.wishlistItem.upsert({
          where: {
            guestId_productId: {
              guestId: ctx.guestId!,
              productId: input.productId,
            },
          },
          update: {},
          create: {
            guestId: ctx.guestId!,
            productId: input.productId,
          },
        });
      }
      return { message: "Added to wishlist" };
    }),
  removeFromWishList: publicProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/wishlist/{productId}",
        tags: ["Wishlist"],
        description: "Remove product from wishlist",
      },
    })
    .input(z.object({ productId: z.number() }))
    .output(simpleMessageResponse)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user) {
        await ctx.prisma.wishlistItem.deleteMany({
          where: {
            productId: input.productId,
            userId: ctx.user.id,
          },
        });
      } else {
        await ctx.prisma.wishlistItem.deleteMany({
          where: {
            productId: input.productId,
            guestId: ctx.guestId,
          },
        });
      }
      return { message: "Removed from wishlist" };
    }),
  getWishlist: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/wishlist",
        tags: ["Wishlist"],
      },
    })
    .output(z.array(z.number()))
    .query(async ({ ctx }) => {
      const whereCondition = ctx.user
        ? { userId: ctx.user.id }
        : { guestId: ctx.guestId! };

      const items = await ctx.prisma.wishlistItem.findMany({
        where: whereCondition,
        select: {
          productId: true,
        },
      });

      return items.map((item) => item.productId);
    }),
  mergeWishlist: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/merge-wishlist",
        description: "Merge the wishlist product",
        tags: ["Wishlist"],
      },
    })
    .output(simpleMessageResponse)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user || !ctx.guestId) {
        return { message: "Nothing to merge" };
      }
      const user = ctx.user;
      const guestId = ctx.guestId;
      const guestItems = await ctx.prisma.wishlistItem.findMany({
        where: {
          guestId,
        },
      });
      await ctx.prisma.$transaction(
        guestItems.map((item) =>
          ctx.prisma.wishlistItem.upsert({
            where: {
              userId_productId: {
                userId: user.id,
                productId: item.productId,
              },
            },
            update: {},
            create: {
              userId: user.id,
              productId: item.productId,
            },
          }),
        ),
      );

      await ctx.prisma.wishlistItem.deleteMany({
        where: {
          guestId: ctx.guestId,
        },
      });
      ctx.res.clearCookie("guestId");
      return { message: "Wishlist merged" };
    }),
});
