import { FilterState } from "@/features/filters/filterSlice";

export function buildProductUrl(
  filters: FilterState["selected"],
  sort: string = "",
  search: string = "",
) {
  const params = new URLSearchParams();
  if (filters.category.length) {
    filters.category.forEach((c) => params.append("category", c));
  }
  if (filters.brand.length) {
    filters.category.forEach((b) => params.append("brand", b));
  }
  if (filters.tag.length) filters.tag.forEach((t) => params.append("tag", t));

  if (filters.rating) params.set("rating", String(filters.rating));
  if (filters.page > 1) params.set("page", String(filters.page));

  if (sort) params.set("sort", sort);
  if (search) params.set("search", search);
  return `/products?${params.toString()}`;
}
