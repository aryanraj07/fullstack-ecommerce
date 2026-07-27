"use client";

import { setSortValue } from "@/features/filters/filterSlice";
import { useAppDispatch } from "@/hooks/hooks";
import { X } from "lucide-react";

const SORT_OPTIONS = [
  {
    value: "price_asc",
    label: "Price : Low To High",
  },
  {
    value: "price_desc",
    label: "Price : High To Low",
  },
  {
    value: "rating_desc",
    label: "Top Rated",
  },
  {
    value: "newest",
    label: "Newest First",
  },
];

export default function MobileSort({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-[100]" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-2xl">
        <div className="flex items-center justify-between px-4 h-14 border-b">
          <h2 className="font-semibold">Sort By</h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="py-2">
          {SORT_OPTIONS.map((item) => (
            <button
              onClick={() => {
                dispatch(setSortValue(item.value));
                onClose();
              }}
              key={item.value}
              className="w-full text-left px-4 py-4 border-b text-sm"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
