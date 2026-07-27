"use client";
import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-pulse w-full">
      {/* Image skeleton */}
      <div className="w-full h-48 sm:h-56 md:h-64 bg-gray-200"></div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>

        <div className="flex items-center gap-2 pt-1">
          <div className="h-3 bg-gray-300 rounded w-12"></div>
          <div className="h-3 bg-gray-200 rounded w-6"></div>
        </div>

        <div className="h-5 bg-gray-300 rounded w-16"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
