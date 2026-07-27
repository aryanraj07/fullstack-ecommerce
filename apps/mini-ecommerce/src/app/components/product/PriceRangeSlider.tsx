"use client";

import { setPriceRange } from "@/features/filters/filterSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { useEffect, useState } from "react";
import { Range, getTrackBackground } from "react-range";

const STEP = 100;
type PriceRange = {
  min: number;
  max: number;
};

const PriceRangeSlider: React.FC = () => {
  const dispatch = useAppDispatch();
  const { priceRange } = useAppSelector((state) => state.filter.selected);
  const [localPriceRange, setLocalPriceRnge] = useState<number[]>([
    priceRange.min,
    priceRange.max,
  ]);
  const bounds = useAppSelector((state) => state.filter.available?.priceRange);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (localPriceRange[0] && localPriceRange[1]) {
        dispatch(
          setPriceRange({
            min: localPriceRange[0],
            max: localPriceRange[1],
          }),
        );
      }
    }, 400);
    return () => clearTimeout(timerId);
  }, [localPriceRange]);

  if (!bounds) {
    return null;
  }
  return (
    <div className="w-full px-2">
      {/* Labels */}
      <div className="flex justify-between text-sm font-medium mb-3">
        <span>₹{localPriceRange[0]}</span>
        <span>₹{localPriceRange[1]}</span>
      </div>

      {/* Slider */}
      <Range
        values={localPriceRange}
        step={STEP}
        min={bounds.min}
        max={bounds.max}
        onChange={(vals) => setLocalPriceRnge(vals)}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-1 w-full rounded bg-gray-200"
            style={{
              background: getTrackBackground({
                values: localPriceRange,
                colors: ["#e5e7eb", "#E16249", "#e5e7eb"],
                min: bounds.min,
                max: bounds.max,
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => {
          const { key, ...rest } = props;
          return (
            <div
              key={key}
              {...rest}
              className="h-5 w-5 rounded-full bg-white border-2 border-[#E16249] shadow-md"
            />
          );
        }}
      />
    </div>
  );
};

export default PriceRangeSlider;
