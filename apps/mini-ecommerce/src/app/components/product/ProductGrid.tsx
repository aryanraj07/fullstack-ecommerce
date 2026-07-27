"use client";

import ProductCard from "@/app/components/common/ProductCard";
import ProductSkeleton from "@/app/components/skelton/ProductSkelton";
// import { Profiler } from "react";
import { ProductPreview } from "@/types/types";
interface ProductGridProps {
  products: ProductPreview[];
  isFetching: boolean;
}
const ProductGrid = ({ products, isFetching }: ProductGridProps) => {
  if (isFetching && products.length === 0) {
    return [...Array(8)].map((_, i) => <ProductSkeleton key={i} />);
  }

  if (!products?.length) {
    return <p>No products matched your search</p>;
  }
  // const onRenderCallback = (
  //   id,
  //   phase,
  //   actualDuration,
  //   baseDuration,
  //   startTime,
  //   commitTime,
  //   interactions,
  // ) => {
  //   console.log({ id, phase, actualDuration, baseDuration });
  // };
  return (
    <>
      {products.map((product: ProductPreview) => (
        <li key={product.id}>
          {/* <Profiler id="ProductList" onRender={onRenderCallback}> */}
          <ProductCard product={product} showRemove={false} variant="default" />
          {/* </Profiler> */}
        </li>
      ))}
    </>
  );
};

export default ProductGrid;
