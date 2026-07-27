import { Product } from "@/types/products";
import { cacheLife } from "next/cache";

const fetchProducts = async (
  category: string,
  sort: string,
  query: string
): Promise<Product[]> => {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (sort !== "none") params.set("sort", sort);
  if (query) params.set("query", query);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?${params.toString()}`,
    {
      next: {
        tags: ["products"],
        revalidate: 300,
      },
    }
  );

  return res.json();
};

export default fetchProducts;
