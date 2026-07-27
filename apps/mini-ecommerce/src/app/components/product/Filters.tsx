"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import PriceRangeSlider from "./PriceRangeSlider";
import {
  clearFilters,
  toggleCategory,
  toggleBrand,
  toggleTag,
  setRating,
  FilterOption,
} from "@/features/filters/filterSlice";
import { Search } from "lucide-react";
import { useState } from "react";

const MAX_VISIBLE = 8;
type FilterItem = {
  value: string | null;
  count: number;
};
type FilterUIState = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showAll?: boolean;
  setShowAll?: React.Dispatch<React.SetStateAction<boolean>>;
};
type RenderListProps = {
  title: string;
  list: FilterItem[];
  visible: FilterItem[];
  selectedValues: string[];
  toggleAction: ActionCreatorWithPayload<string>;
  ui: FilterUIState;
};

type FilterStateProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  showAll: boolean;
  setShowAll: React.Dispatch<React.SetStateAction<boolean>>;
};

const Filters = () => {
  const dispatch = useAppDispatch();

  const available = useAppSelector((state) => state.filter.available);
  const selected = useAppSelector((state) => state.filter.selected);
  const {
    categories = [],
    brands = [],
    tags = [],
    ratingRange = { max: 5 },
  } = available ?? {};

  /* ---------------- UI state ---------------- */
  const [categorySearch, setCategorySearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  /* ---------------- helpers ---------------- */

  const filterList = (list: FilterItem[], search: string) =>
    list.filter((i) => i.value?.toLowerCase().includes(search.toLowerCase()));

  const categoriesFiltered = filterList(categories, categorySearch);

  const brandsFiltered = filterList(brands, brandSearch);

  const tagsFiltered = filterList(tags, tagSearch);

  const categoriesVisible = showAllCategories
    ? categoriesFiltered
    : categoriesFiltered.slice(0, MAX_VISIBLE);

  const brandsVisible = showAllBrands
    ? brandsFiltered
    : brandsFiltered.slice(0, MAX_VISIBLE);

  const tagsVisible = showAllTags
    ? tagsFiltered
    : tagsFiltered.slice(0, MAX_VISIBLE);
  /* ---------------- reusable checkbox list ---------------- */
  if (!available) return null;
  const renderList = ({
    title,
    list,
    visible,
    selectedValues,
    toggleAction,
    ui,
  }: RenderListProps) => {
    const { search, setSearch, showAll, setShowAll } = ui;
    return (
      <div>
        <h3 className="text-sm font-semibold mb-2">{title}</h3>

        <div className="flex items-center gap-2 mb-2">
          <Search size={16} />
          <input
            type="text"
            placeholder={`Search ${title}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-full"
          />
        </div>

        <div className="space-y-2">
          {visible.map(({ value, count }) => (
            <label
              key={value}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={value ? selectedValues.includes(value) : false}
                  onChange={() => value && dispatch(toggleAction(value))}
                />
                <span>{value}</span>
              </div>
              <span className="text-xs text-gray-500">({count})</span>
            </label>
          ))}
        </div>

        {setShowAll && list.length > MAX_VISIBLE && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-pink-600 mt-2 text-center"
          >
            {showAll ? "Show less" : `+ ${list.length - MAX_VISIBLE} more`}
          </button>
        )}
      </div>
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between border-b pb-3">
        <span className="font-semibold">Filters</span>
        <button
          className="text-sm text-red-500"
          onClick={() => dispatch(clearFilters())}
        >
          Clear All
        </button>
      </div>

      {/* Price */}
      <PriceRangeSlider />

      {/* Categories */}
      {renderList({
        title: "Categories",
        list: categoriesFiltered,
        visible: categoriesVisible,
        toggleAction: toggleCategory,
        selectedValues: selected.category,
        ui: {
          search: categorySearch,
          setSearch: setCategorySearch,
          showAll: showAllCategories,
          setShowAll: setShowAllCategories,
        },
      })}

      {/* Brands */}
      {renderList({
        title: "Brands",
        list: brandsFiltered,
        visible: brandsVisible,
        selectedValues: selected.brand,
        toggleAction: toggleBrand,
        ui: {
          search: brandSearch,
          setSearch: setBrandSearch,
          showAll: showAllBrands,
          setShowAll: setShowAllBrands,
        },
      })}

      {/* Tags (show all, no show-more) */}
      {renderList({
        title: "Tags",
        list: tagsFiltered,
        visible: tagsVisible,
        toggleAction: toggleTag,
        selectedValues: selected.tag,
        ui: {
          search: tagSearch,
          setSearch: setTagSearch,
          showAll: showAllTags,
          setShowAll: setShowAllTags,
        },
      })}

      {/* Rating */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Rating</h3>

        <div className="space-y-2">
          {Array.from({ length: ratingRange.max }, (_, i) => {
            const rating = i + 1;
            return (
              <label
                key={rating}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={selected.rating === rating}
                  onChange={() => dispatch(setRating(rating))}
                />
                <span>{rating} ★ & up</span>
              </label>
            );
          })}
          <button onClick={() => dispatch(setRating(0))}>Clear Rating</button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
