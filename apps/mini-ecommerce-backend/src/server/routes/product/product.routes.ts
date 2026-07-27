import z, { number } from "zod";
import { router, publicProcedure } from "../../trpc.js";
import {
  getAllProductOutput,
  getSingleProductOutput,
  similarProductsOutput,
} from "./models.js";
import { TRPCError } from "@trpc/server";
import type { Prisma } from "@repo/db/client";
type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    brand: true;
    tags: {
      include: { tag: true };
    };
  };
}>;
export const productRouter = router({
  getAllProducts: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/products",
        tags: ["Product"],
        description: "Returns all products",
      },
    })
    .input(
      z.object({
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(20),
        // Dynamic filters
        category: z.array(z.string()).optional(),
        brand: z.array(z.string()).optional(),
        tag: z.array(z.string()).optional(),
        min: z.coerce.number().optional(),
        // coerce uses Js Number constructor internally
        max: z.coerce.number().optional(),
        rating: z.coerce.number().optional(),
        search: z.string().optional(),
        sort: z.string().optional(),
        ids: z.array(z.number()).optional(),
      }),
    )
    .output(getAllProductOutput)
    .query(async ({ ctx, input }) => {
      const {
        page,
        limit,
        category,
        brand,
        tag,
        min,
        max,
        rating,
        search,
        sort,
        ids,
      } = input;
      const where: any = {};
      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }
      if (category?.length) {
        where.category = { name: { in: category } };
      }
      if (brand?.length) where.brand = { name: { in: brand } };
      if (rating) where.rating = { gte: rating };
      if (min || max) {
        where.price = {
          gte: min ?? 0,
          lte: max ?? 999999,
        };
      }
      if (tag?.length) {
        where.tags = {
          some: {
            tag: { name: { in: tag } },
          },
        };
      }
      if (ids) {
        where.id = { in: ids };
      }

      // Sorting
      const orderBy: any = (() => {
        switch (sort) {
          case "price_asc":
            return { price: "asc" };
          case "price_desc":
            return { price: "desc" };
          case "rating_desc":
            return { rating: "desc" };
          case "newest":
            return { createdAt: "desc" };
          default:
            return { createdAt: "desc" };
        }
      })();
      // query
      const p2 = Date.now();
      const [rawProducts, total] = await Promise.all([
        ctx.prisma.product.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy,
          include: {
            category: true,
            brand: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
        }),

        ctx.prisma.product.count({ where }),
      ]);

      const products = rawProducts.map((p) => {
        const price = Number(p.price);

        const discountPercentage = p.discountPercentage ?? 0;

        const discountedPrice = Number(
          (price * (1 - discountPercentage / 100)).toFixed(2),
        );
        return {
          id: p.id,
          title: p.title,
          price: price,
          category: p.category ?? null,
          brand: p.brand ?? null,
          thumbnail: p.thumbnail ?? "",
          discountPercentage: discountPercentage,
          stock: p.stock,
          rating: p.rating ?? 0,
          brandName: p.brand?.name ?? "",
          tags: p.tags?.map((t) => t.tag) ?? [],
          discountedPrice: discountedPrice,
        };
      });

      return {
        products: products,
        meta: {
          current_page: page,
          last_page: Math.ceil(total / limit),
          total,
        },
      };
    }),
  getSingleProduct: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/products/{id}",
        tags: ["Product"],
        description: "Returns single product details",
      },
    })
    .input(
      z.object({
        id: z.coerce.number(),
      }),
    )
    .output(getSingleProductOutput)
    .query(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.findUnique({
        where: {
          id: input.id,
        },
        include: {
          category: true,
          brand: true,
          reviews: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      return {
        product: {
          ...product,
          price: Number(product.price),
          tags: product.tags.map((t) => t.tag) ?? [],
        },
      };
    }),
  getSimilarProducts: publicProcedure
    .meta({
      openapi: {
        path: "/similar-products",
        method: "GET",
        description: "Get similar products",
        tags: ["Product", "Similar-Product"],
      },
    })
    .input(
      z.object({
        productId: z.number(),
      }),
    )
    .output(similarProductsOutput)
    .query(async ({ ctx, input }) => {
      const baseProduct = await ctx.prisma.product.findUnique({
        where: { id: input.productId },
        include: { tags: true },
      });

      if (!baseProduct) {
        throw new Error("Product not found");
      }

      const price = Number(baseProduct.price);
      const priceMin = price * 0.7;
      const priceMax = price * 1.3;

      const tagIds = baseProduct.tags.map((t) => t.tagId);

      const products: ProductWithRelations[] =
        await ctx.prisma.product.findMany({
          where: {
            id: { not: input.productId },
            OR: [
              { categoryId: baseProduct.categoryId },

              ...(baseProduct.brandId
                ? [{ brandId: baseProduct.brandId }]
                : []),

              {
                tags: {
                  some: { tagId: { in: tagIds } },
                },
              },

              {
                price: {
                  gte: priceMin,
                  lte: priceMax,
                },
              },
            ],
          },
          include: {
            category: true,
            brand: true,
            tags: {
              include: { tag: true },
            },
          },
          orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
          take: 8,
        });

      const mappedProducts = products.map((p) => {
        const price = Number(p.price);
        const discountPercentage = p.discountPercentage ?? 0;

        const discountedPrice = Number(
          (price * (1 - discountPercentage / 100)).toFixed(2),
        );

        return {
          id: p.id,
          title: p.title,
          price,
          category: p.category ?? null,
          brand: p.brand ?? null,
          thumbnail: p.thumbnail ?? "",
          discountPercentage,
          stock: p.stock,
          rating: p.rating ?? 0,
          brandName: p.brand?.name ?? "",
          tags: p.tags?.map((t) => t.tag) ?? [],
          discountedPrice,
        };
      });

      return {
        products: mappedProducts,
      };
    }),
});
