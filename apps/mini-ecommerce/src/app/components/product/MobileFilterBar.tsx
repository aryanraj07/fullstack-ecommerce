"use client";
import { useState } from "react";
import MobileFilters from "./MobileFilters";
import MobileSort from "./MobileSort";
import { ArrowUpDown, FunnelPlus } from "lucide-react";

export default function MobileFilterBar() {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  return (
    <div className="bg-white fixed left-0 right-0 bottom-0 z-50 md:hidden border-t ">
      <div className="grid grid-cols-2 h-14">
        <button
          onClick={() => setShowSort(true)}
          className="font-medium border-r"
        >
          <ArrowUpDown /> Sort
        </button>
        <button onClick={() => setShowFilters(true)} className="font-medium">
          <FunnelPlus /> Filters
        </button>
      </div>
      <MobileFilters open={showFilters} onClose={() => setShowFilters(false)} />
      <MobileSort open={showSort} onClose={() => setShowSort(false)} />
      {/* <div>FIlter</div> */}
      {/* <div>Sort</div> */}
    </div>
  );
}
