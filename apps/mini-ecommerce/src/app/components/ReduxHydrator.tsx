"use client";
import { setInitialFilters } from "@/features/filters/filterSlice";

import { useAppDispatch } from "@/hooks/hooks";
import { FilterDataOutput } from "@/types/types";
import React, { useEffect, useRef } from "react";
interface FilterDataOutputProps {
  filtersData: FilterDataOutput;
}
const ReduxHydrator = ({ filtersData }: FilterDataOutputProps) => {
  const dispatch = useAppDispatch();

  const filterRef = useRef(false);
  useEffect(() => {
    if (filtersData || !filterRef.current) {
      filterRef.current = true;
      dispatch(setInitialFilters(filtersData));
    }
  }, [filtersData, dispatch]);

  return null;
};

export default ReduxHydrator;
