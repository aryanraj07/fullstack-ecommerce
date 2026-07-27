// getProducts.ts
import { cacheLife } from "next/cache";
import { createServerTRPCClient } from "@/utils/fetchServerData";

export const defaultProductQuery = {
  min: undefined,
  max: undefined,
  category: [],
  brand: [],
  tag: [],
  rating: undefined,
  page: 1,
  limit: 20,
  sort: undefined,
  search: undefined,
};

export async function getProducts() {
  "use cache";
  cacheLife("minutes");
  const trpc = createServerTRPCClient(null);
  const result = await trpc.products.getAllProducts.query(defaultProductQuery);
  return result;
}
