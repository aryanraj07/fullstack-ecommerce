"use client";

import { Search } from "lucide-react";
import { useAppDispatch } from "@/hooks/hooks";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

type Props = {
  title: string;
  items: {
    value: string | null;
    count: number;
  }[];

  selectedValues: string[];

  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;

  toggleAction: ActionCreatorWithPayload<string>;
};

export default function FilterList({
  title,
  items,
  selectedValues,
  search,
  setSearch,
  toggleAction,
}: Props) {
  const dispatch = useAppDispatch();

  return (
    <div>
      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${title}`}
          className="w-full border rounded-lg py-2 pl-10 pr-3 text-sm"
        />
      </div>

      <div className="space-y-4">
        {items.map(({ value, count }) => {
          if (!value) return null;

          return (
            <label key={value} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(value)}
                  onChange={() => dispatch(toggleAction(value))}
                />

                <span className="text-sm">{value}</span>
              </div>

              <span className="text-xs text-gray-500">{count}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
