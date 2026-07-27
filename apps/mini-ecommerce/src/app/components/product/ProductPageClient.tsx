// ProductPageClient.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

interface ProductsPageClientProps {
  initialData: ProductsOutput;
}

import Filters from "@/app/components/product/Filters";
import ProductGrid from "./ProductGrid";
import { startTransition, useEffect, useMemo } from "react";
import Dropdown from "../Dropdown";
import { sortedOptions } from "@/constants";
import { setCategory, setSortValue } from "@/features/filters/filterSlice";

import { useTRPC } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import PaginationButton from "../common/PaginationButton";
import { ProductsOutput } from "@/types/types";
import { useRouter, useSearchParams } from "next/navigation";
import { buildProductUrl } from "@/utils/buildProductUrls";

const ProductPageClient = ({ initialData }: ProductsPageClientProps) => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const filters = useAppSelector((state) => state.filter.selected);
  const router = useRouter();

  const { priceRange, category, brand, tag, rating } = filters;
  const page = filters.page;
  const trpc = useTRPC();
  const { sort, search } = useAppSelector((state) => state.filter);

  const queryInput = useMemo(
    () => ({
      min: priceRange?.min || undefined,
      max: priceRange?.max || undefined,
      category: [...category].sort(),
      brand: [...brand].sort(),
      tag: [...tag].sort(),
      rating,
      page,
      limit: 20,
      sort,
      search,
    }),
    [priceRange, category, brand, tag, rating, page, sort, search],
  );

  const hasUrlFilters = useMemo(() => {
    return (
      searchParams.getAll("category").length > 0 ||
      searchParams.getAll("brand").length > 0 ||
      searchParams.getAll("tag").length > 0 ||
      searchParams.get("rating") !== null ||
      searchParams.get("search") !== null
    );
  }, [searchParams]);

  const queryOptions = trpc.products.getAllProducts.queryOptions(queryInput);

  const { data, isFetching } = useQuery({
    ...queryOptions,
    staleTime: 0,
    initialData: page === 1 && !hasUrlFilters ? initialData : undefined,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // const { products = [], meta } = data as ProductsOutput;
  const products = data?.products ?? [];
  const meta = data?.meta;
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    }
  }, [page]);
  useEffect(() => {
    const url = buildProductUrl(filters, sort, search);

    const current = window.location.pathname + window.location.search;

    if (url !== current) {
      startTransition(() => {
        router.replace(url, { scroll: false });
      });
    }
  }, [filters, sort, search]);
  const { total = 0 } = meta ?? {};
  useEffect(() => {
    const categoryParam = searchParams.get("category");

    if (categoryParam && categoryParam !== category[0]) {
      dispatch(setCategory([categoryParam]));
    }
  }, []);

  return (
    <div className="flex">
      <div className="w-72 sticky top-0 p-6 hidden md:block">
        <Filters />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-5">
          <h2>{total} Products</h2>
          <Dropdown
            options={sortedOptions}
            onChange={(option) => {
              dispatch(setSortValue(option.value));
            }}
            placeholder="Select Category"
            value={sort}
          />
        </div>

        <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-content-center flex-1">
          <ProductGrid products={products} isFetching={isFetching} />
        </ul>
        {meta && (
          <PaginationButton
            currentPage={meta.current_page}
            lastPage={meta.last_page}
          />
        )}
      </div>
    </div>
  );
};

export default ProductPageClient;
