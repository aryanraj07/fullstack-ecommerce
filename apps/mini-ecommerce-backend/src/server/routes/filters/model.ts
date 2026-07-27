import z from "zod";
import { brandModel } from "../product/models.js";

export const filterOptionModel = z.object({
  value: z.string().nullable().describe("Display value"),
  count: z.number().int().describe("Number of products available"),
});

export const priceRangeModel = z.object({
  min: z.number().describe("Minimum product price"),
  max: z.number().describe("Maximum product price"),
});
export const ratingRangeModel = z.object({
  max: z.number().describe("Maximum rating available"),
});
// Dynmaic json attribute
export const attributesModel = z
  .object({})
  .catchall(z.array(z.string()))
  .describe("Dynamic attributes extracted from product meta JSON");

//sort options
export const sortOptionsModel = z.array(
  z.enum(["price_asc", "price_desc", "rating_desc", "newest"]),
);
// final filter options
export const getFilterDataOutput = z.object({
  categories: z.array(filterOptionModel),
  brands: z.array(filterOptionModel),
  tags: z.array(filterOptionModel),
  priceRange: priceRangeModel,
  ratingRange: ratingRangeModel,
  attributes: attributesModel,
  sortOptions: sortOptionsModel,
});

export type FilterDataOutput = z.infer<typeof getFilterDataOutput>;
