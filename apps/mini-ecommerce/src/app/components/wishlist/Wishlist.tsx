"use client";
import ProductCard from "../common/ProductCard";
import { useTRPC } from "@/utils/trpc";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { ProductPreview, ProductsOutput, WishlistItem } from "@/types/types";

const Wishlist = () => {
  const trpc = useTRPC();
  const wishlistQueryKey = trpc.wishlistItems.getWishlist.queryKey();

  const { data: wishlistData = [], isLoading } = useQuery({
    ...trpc.wishlistItems.getWishlist.queryOptions(),
    queryKey: wishlistQueryKey,
    refetchOnMount: true,
  });
  const wishlistIds = wishlistData as WishlistItem;
  const { data: productsData } = useQuery(
    trpc.products.getAllProducts.queryOptions(
      { ids: wishlistIds },
      {
        enabled: wishlistIds.length > 0,
      },
    ),
  );
  const products = (productsData as ProductsOutput | undefined)?.products ?? [];
  if (isLoading) {
    return (
      <div>
        <h3>My Wishlists</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          Loading...
        </div>
      </div>
    );
  }
  return (
    <div>
      <h3 className="">
        My Wishlists <span>{wishlistIds?.length} items</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cold-2  md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center]">
        {products?.map((product: ProductPreview) => (
          <ProductCard
            key={product.id}
            product={product}
            variant={"wishlist"}
            showRemove={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
