"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useAddToCart } from "@/hooks/useAddToCart";
import { CartItem } from "@/types/types";
import { showCustomToast } from "@/utils/showToast";
import { useTRPC } from "@/utils/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
type CartQueryData = {
  cartItem: CartItem[];
};
const AddToCartButton = ({
  id,
  image,
}: {
  id: number;
  image: string | null;
}) => {
  const addToCartMutation = useAddToCart();
  const router = useRouter();
  const handleAddToCart = () => {
    addToCartMutation.mutate(
      {
        productId: id,
        quantity: 1,
      },
      {
        onSuccess: () => {
          showCustomToast("Item added to cart", image, () =>
            router.push("/cart"),
          );
        },
        onError: (err) => {
          console.log("ERROR", err);
        },
      },
    );
  };
  return (
    <button
      className="px-6 py-3 bg-black text-white rounded-md  hover:bg-gray-700 transition"
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
