"use client";
import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import { showCustomToast } from "@/utils/showToast";
import { useRouter } from "next/navigation";
import { WishlistItem } from "@/types/types";
import { useWishlist } from "@/hooks/useWishlist";
interface WishlistButtonProps {
  id: number;
  image: string | null;
}

const WishlistButton = ({ id, image }: WishlistButtonProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const { data = [] } = useQuery(
    trpc.wishlistItems.getWishlist.queryOptions(undefined, {
      staleTime: 1000 * 60 * 5,
    }),
  );
  const wishlist = (data as WishlistItem | undefined) ?? [];
  const isWishlisted = new Set(wishlist).has(id);
  const { addToWishlist, removeFromWishlist } = useWishlist();

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist.mutate({ productId: id });
      showCustomToast("Item removed from wishlit", image, () =>
        router.push("/wishlist"),
      );
    } else {
      addToWishlist.mutate({ productId: id });
      showCustomToast("Item  wishlisted", image, () =>
        router.push("/wishlist"),
      );
    }
  };

  return (
    <button
      onClick={handleWishlist}
      className={`flex items-center gap-2 px-6 py-2 rounded-lg border transition ${
        isWishlisted
          ? "bg-gray-900 text-white"
          : "bg-white text-gray-700 border-gray-200"
      }`}
    >
      {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
      {isWishlisted ? "Wishlisted" : "Wishlist"}
    </button>
  );
};

export default WishlistButton;
