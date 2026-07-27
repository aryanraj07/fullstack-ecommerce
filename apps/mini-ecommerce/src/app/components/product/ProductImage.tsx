import Image from "next/image";
import React from "react";
import WishlistButton from "@/app/components/common/WishlistButton";
interface ProductImageProps {
  id: number;
  thumbnail: string | null;
  title: string;
  discountPercentage: number | null;
  stock?: number | null;
}
const ProductImage = ({
  thumbnail,
  title,
  id,
  discountPercentage,
  stock,
}: ProductImageProps) => {
  return (
    <div className="relative h-56 bg-gray-50 overflow-hidden">
      <Image
        src={thumbnail ?? "/placeholder.png"}
        alt={title}
        fill
        sizes="(max-width:768px) 100vw, 33vw"
        className="object-contain group-hover:scale-105 transition duration-300"
      />

      {/* Discount */}
      {discountPercentage && (
        <span className="absolute top-3 left-3 bg-[#E16249] text-white text-xs px-2 py-1 rounded-md font-semibold">
          {Math.round(discountPercentage)}% OFF
        </span>
      )}

      {/* Stock */}
      {stock === 0 && (
        <span className="absolute top-3 right-3 bg-black text-white text-xs px-2 py-1 rounded-md">
          Out of stock
        </span>
      )}

      {/* ACTIONS */}
      <div className="absolute bottom-0 flex w-full  justify-center opacity-0 group-hover:opacity-100 transition duration-300">
        <WishlistButton id={id} image={thumbnail} />
      </div>
    </div>
  );
};

export default ProductImage;
