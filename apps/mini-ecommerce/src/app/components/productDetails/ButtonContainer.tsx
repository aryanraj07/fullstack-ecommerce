"use client";
import React from "react";
import AddToCartButton from "../common/AddToCartButton";
import { useAppDispatch } from "@/hooks/hooks";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ButtonContainer = ({ id, image }: { id: number; image: string }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const showCustomToast = (
    message: string,
    img: string,
    onClick: () => void,
  ) => {
    toast.custom((t) => (
      <div
        onClick={() => {
          toast.dismiss(t.id);
          onClick();
        }}
        className={`${
          t.visible ? "animate-toast-in" : "animate-toast-out"
        } flex items-center gap-3 cursor-pointer
      bg-white border border-gray-200 rounded-xl shadow-md
      px-3 py-3 w-60 sm:w-[300px]
      transition-all hover:shadow-lg`}
      >
        <div className="relative w-10 h-10 bg-gray-100 rounded-md shadow-sm">
          <Image src={img} alt="img" fill className="object-contain" />
        </div>

        <div className="flex flex-col text-xs sm:text-sm text-gray-900 leading-tight">
          <span className="font-medium">{message}</span>
          <span className="text-blue-600 underline pt-1">Tap to view →</span>
        </div>
      </div>
    ));
  };

  return (
    <div className="btn-container flex items-center gap-3 p-2">
      {/* <button
        className="px-6 py-3 bg-black text-white rounded-md  hover:bg-gray-700 transition"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button> */}
      <AddToCartButton id={id} image={image} />
      <button className=" px-6 py-3 bg-black text-white rounded-md  hover:bg-gray-700 transition">
        Buy Now
      </button>
    </div>
  );
};

export default ButtonContainer;
