import z from "zod";
import { router, publicProcedure } from "../../trpc.js";
import { getFilterDataOutput } from "./model.js";

const toNumber = (d: any) => (d ? Number(d) : 0);
export const filterRouter = router({
  getFilterData: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/filters",
        tags: ["Filter"],
        description: "Return dynamic filters metadata",
      },
    })
    .output(getFilterDataOutput)
    .query(async ({ ctx }) => {
      // categories
      const categoryGroups = await ctx.prisma.product.groupBy({
        by: ["categoryId"],
        _count: true,
      });
      const categoryMap = await ctx.prisma.category.findMany();
      const categories = categoryGroups.map((c) => ({
        value: categoryMap.find((x) => x.id === c.categoryId)?.name ?? null,
        count: c._count,
      }));
      const brandGroup = await ctx.prisma.product.groupBy({
        by: ["brandId"],
        _count: true,
      });
      const brandMap = await ctx.prisma.brand.findMany();
      const brands = brandGroup.map((b) => ({
        value: brandMap.find((x) => x.id === b.brandId)?.name ?? null,
        count: b._count,
      }));
      // Tags
      const tagGroups = await ctx.prisma.productTag.groupBy({
        by: ["tagId"],
        _count: true,
      });
      const tagMap = await ctx.prisma.tag.findMany();

      const tags = tagGroups.map((t) => ({
        value: tagMap.find((x) => x.id === t.tagId)?.name ?? null,
        count: t._count,
      }));
      // price range
      const price = await ctx.prisma.product.aggregate({
        _min: { price: true },
        _max: { price: true },
      });
      //rating range
      const rating = await ctx.prisma.product.aggregate({
        _max: { rating: true },
      });
      //dynamic json attribute
      const rawMeta: any[] = await ctx.prisma.$queryRaw`
  SELECT DISTINCT jsonb_object_keys(meta) AS key
  FROM "Product"
`;

      const attributes: Record<string, string[]> = {};

      for (const row of rawMeta) {
        const key = row.key;

        const values: any[] = await ctx.prisma.$queryRawUnsafe(
          `SELECT DISTINCT meta->>'${key}' AS value
     FROM "Product"
     WHERE meta->>'${key}' IS NOT NULL`,
        );

        attributes[key] = values.map((v) => v.value);
      }
      return {
        categories,
        brands,
        tags,
        priceRange: {
          min: toNumber(price._min.price),
          max: toNumber(price._max.price),
        },
        ratingRange: {
          max: rating._max.rating ?? 5,
        },
        attributes,
        sortOptions: ["price_asc", "price_desc", "rating_desc", "newest"],
      };
    }),
});
