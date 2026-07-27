"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  clearFilters,
  toggleCategory,
  toggleBrand,
  toggleTag,
  setRating,
} from "@/features/filters/filterSlice";
import PriceRangeSlider from "./PriceRangeSlider";
import FilterList from "./FilterList";

const MAX_VISIBLE = 8;

export default function MobileFilters({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();

  const available = useAppSelector((state) => state.filter.available);
  const selected = useAppSelector((state) => state.filter.selected);

  const [activeTab, setActiveTab] = useState("price");

  const [categorySearch, setCategorySearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  if (!open || !available) return null;

  const {
    categories = [],
    brands = [],
    tags = [],
    ratingRange = { max: 5 },
  } = available;

  const filterList = (
    list: { value: string | null; count: number }[],
    search: string,
  ) =>
    list.filter((item) =>
      item.value?.toLowerCase().includes(search.toLowerCase()),
    );

  const tabs = [
    {
      key: "price",
      label: "Price",
    },
    {
      key: "categories",
      label: `Categories (${selected.category.length})`,
    },
    {
      key: "brands",
      label: `Brands (${selected.brand.length})`,
    },
    {
      key: "tags",
      label: `Tags (${selected.tag.length})`,
    },
    {
      key: "rating",
      label: "Rating",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "price":
        return <PriceRangeSlider />;

      case "categories":
        return (
          <FilterList
            title="Categories"
            items={filterList(categories, categorySearch)}
            selectedValues={selected.category}
            search={categorySearch}
            setSearch={setCategorySearch}
            toggleAction={toggleCategory}
          />
        );
      case "brands":
        return (
          <FilterList
            title="Brands"
            items={filterList(brands, brandSearch)}
            selectedValues={selected.brand}
            search={brandSearch}
            setSearch={setBrandSearch}
            toggleAction={toggleBrand}
          />
        );

      case "tags":
        return (
          <FilterList
            title="Tags"
            items={filterList(tags, tagSearch)}
            selectedValues={selected.tag}
            search={tagSearch}
            setSearch={setTagSearch}
            toggleAction={toggleTag}
          />
        );

      case "rating":
        return (
          <div className="space-y-4">
            {Array.from({ length: Math.floor(ratingRange.max) }, (_, i) => {
              const rating = i + 1;

              return (
                <label key={rating} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="rating"
                    checked={selected.rating === rating}
                    onChange={() => dispatch(setRating(rating))}
                  />

                  <span>{rating} ★ & Up</span>
                </label>
              );
            })}

            <button
              className="text-red-500 text-sm"
              onClick={() => dispatch(setRating(0))}
            >
              Clear Rating
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white md:hidden">
      {/* Header */}

      <div className="flex items-center justify-between px-4 h-14 border-b">
        <h2 className="font-semibold text-lg">Filters</h2>

        <button onClick={onClose}>
          <X size={22} />
        </button>
      </div>

      {/* Content */}

      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Menu */}

        <aside className="w-36 border-r bg-gray-50 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full text-left px-4 py-4 text-sm border-b transition ${
                activeTab === tab.key
                  ? "bg-white font-semibold text-black"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Right Content */}

        <div className="flex-1 overflow-y-auto p-4">{renderContent()}</div>
      </div>

      {/* Footer */}

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t flex">
        <button
          onClick={() => dispatch(clearFilters())}
          className="flex-1 border-r font-medium"
        >
          Clear All
        </button>

        <button
          onClick={onClose}
          className="flex-1 bg-black text-white font-medium"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
