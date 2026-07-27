"use client";

import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { CartItem } from "@/types/types";

interface Props {
  item: CartItem;
  selectedItems: number[];
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRemove?: () => void;
  onSelectItem: (cartItemId: number) => void;
}

const CartItemCard = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  onSelectItem,
  selectedItems,
}: Props) => {
  return (
    <div className="flex flex-col sm:flex-row gap-5 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
      {/* Product Image */}
      <div className="relative w-full sm:w-32 h-40 sm:h-32 rounded-xl overflow-hidden bg-gray-50 relative">
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          className="object-cover"
        />
        <input
          type="checkbox"
          className="absolute top-3 left-4 w-5 h-5 accent-black cursor-pointer"
          checked={selectedItems.includes(item.id)}
          onChange={() => onSelectItem(item.id)}
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-between flex-1">
        <div className="space-y-2">
          <h2 className="font-semibold text-lg text-gray-900">{item.title}</h2>

          <p className="text-sm text-gray-500">Brand: {item.brandName}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 text-sm text-yellow-500">
            <FaStar />
            <span className="text-gray-600">{item.rating}</span>
          </div>

          {/* Stock */}
          <p className="text-xs text-green-600">
            {item.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <span>Qty</span>
            <div className="flex items-center gap-3 border rounded-lg px-3 py-1 w-fit">
              <button
                onClick={onDecrease}
                className="text-lg font-bold text-gray-600 hover:text-black"
              >
                -
              </button>
              <span className="font-medium">{item.quantity}</span>
              <button
                onClick={onIncrease}
                className="text-lg font-bold text-gray-600 hover:text-black"
              >
                +
              </button>
            </div>
          </div>
          {/* Price Section */}
          <div className="text-right space-y-1">
            {item.discountPercentage && item.discountedPrice ? (
              <>
                <p className="text-sm line-through text-gray-400">
                  ${item.price.toFixed(2)}
                </p>

                <p className="text-lg font-bold text-black">
                  ${item.discountedPrice.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-black">
                ${item.price.toFixed(2)}
              </p>
            )}
          </div>

          {/* Remove Button */}
          <button
            onClick={onRemove}
            className="text-sm text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
