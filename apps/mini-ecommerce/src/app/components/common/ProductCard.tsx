"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import WishlistButton from "./WishlistButton";
import { ProductPreview } from "@/types/types";

import ProductImage from "@/app/components/product/ProductImage";
import ProductMeta from "@/app/components/product/ProductMeta";
import ProductPrice from "@/app/components/product/ProductPrice";
interface ProductCardProps {
  product: ProductPreview;
  variant: "default" | "wishlist";
  showRemove: boolean;
}

const ProductCard = ({
  product,
  variant = "default",
  showRemove,
}: ProductCardProps) => {
  const {
    id,
    title,
    price,
    discountPercentage,
    discountedPrice,
    rating,
    stock,
    thumbnail,
    category,
    brand,
    tags,
    brandName,
  } = product;
  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* IMAGE */}
      <ProductImage
        id={id}
        thumbnail={thumbnail}
        title={title}
        discountPercentage={discountPercentage}
        stock={stock}
      />

      {/* CONTENT */}
      <Link href={`/products/${id}`}>
        <div className="p-4 space-y-2">
          <ProductMeta rating={rating} brandName={brandName} />

          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-black transition">
            {title}
          </h3>

          <ProductPrice
            price={price}
            discountedPrice={discountedPrice ?? null}
            discountPercentage={discountPercentage}
            variant="default"
          />

          <p className="text-xs text-gray-400 capitalize">{category?.name}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
