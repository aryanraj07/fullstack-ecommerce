"use client";

import { setCategory } from "@/features/filters/filterSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { buildProductUrl } from "@/utils/buildProductUrls";
import { useRouter } from "next/navigation";
import React from "react";
const categories = [
  { name: "smartphones", icon: "📱" },
  { name: "laptops", icon: "💻" },
  { name: "fragrances", icon: "🌸" },
  { name: "skincare", icon: "🧴" },
  { name: "groceries", icon: "🛒" },
  { name: "home-decoration", icon: "🏠" },
];

const CategoriesSection = () => {
  const filters = useAppSelector((state) => state.filter.selected);
  const router = useRouter();

  const handleClick = (category: string) => {
    router.push(
      buildProductUrl({
        ...filters,
        category: [category],
      }),
    );
  };

  return (
    <section className="py-10">
      <h2 className="text-2xl font-semibold mb-6">Top Categories</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => handleClick(cat.name)}
            className="cursor-pointer p-6 rounded-xl shadow-md hover:shadow-xl transition bg-white flex flex-col items-center justify-center gap-2"
          >
            <span className="text-3xl">{cat.icon}</span>
            <p className="capitalize text-sm font-medium">{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
