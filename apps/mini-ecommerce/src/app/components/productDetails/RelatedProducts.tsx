"use client";
import CommonSwiper from "../common/CommonSwiper";
import ProductCard from "../common/ProductCard";
import { ProductPreview } from "@/types/types";

const RelatedProducts = ({
  relatedProducts,
}: {
  relatedProducts: ProductPreview[];
}) => {
  return (
    <div className="my-5">
      <h1 className="text-2xl font-semibold mb-6">Related Products</h1>
      <CommonSwiper
        items={relatedProducts}
        renderItem={(p: ProductPreview) => (
          <ProductCard product={p} variant="default" showRemove={false} />
        )}
      />
    </div>
  );
};

export default RelatedProducts;
