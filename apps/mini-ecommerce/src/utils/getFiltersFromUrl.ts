export const getFiltersFromUrl = (searchParams: URLSearchParams) => {
  return {
    category: searchParams.getAll("category"),
    brand: searchParams.getAll("brand"),
    tag: searchParams.getAll("tag"),
    rating: searchParams.getAll("rating"),
    page: Number(searchParams.get("page")) || 1,
    sort: searchParams.get("sort") || "",
    search: searchParams.get("search") || "",
    min: searchParams.get("min") ? Number(searchParams.get("min")) : undefined,
    max: searchParams.get("max") ? Number(searchParams.get("max")) : undefined,
  };
};
