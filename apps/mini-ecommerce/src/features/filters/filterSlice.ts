import { FilterDataOutput } from "@/types/types";
import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FilterOption = {
  id: number;
  value: string;
  count: number;
};

export interface FilterState {
  available: FilterDataOutput | null;
  selected: {
    priceRange: {
      min: number;
      max: number;
    };
    category: string[]; // store category IDs only
    brand: string[];
    tag: string[];
    rating: number;
    page: number;
  };
  sort: string;
  search: string;
}
const toggle = (arr: string[], value: string) =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

const initialState: FilterState = {
  available: null,
  selected: {
    priceRange: {
      min: 0,
      max: 0,
    },
    category: [],
    brand: [],
    tag: [],
    rating: 0,
    page: 1,
  },
  sort: "",
  search: "",
};
const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setInitialFilters: (state, action: PayloadAction<FilterDataOutput>) => {
      state.available = action.payload;
      state.selected.priceRange = action.payload.priceRange;
    },
    setAvailableFilters: (state, action: PayloadAction<FilterDataOutput>) => {
      state.available = action.payload;
    },
    setCategory: (state, action: PayloadAction<string[]>) => {
      state.selected.category = action.payload;
      state.selected.page = 1;
    },
    setSortValue: (state, action) => {
      state.sort = action.payload;
    },
    setPriceRange: (
      state,
      action: PayloadAction<{ min: number; max: number }>,
    ) => {
      state.selected.page = 1;
      state.selected.priceRange = action.payload;
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      state.selected.page = 1;
      state.selected.category = toggle(state.selected.category, action.payload);
    },
    toggleBrand: (state, action: PayloadAction<string>) => {
      state.selected.page = 1;
      state.selected.brand = toggle(state.selected.brand, action.payload);
    },
    toggleTag: (state, action: PayloadAction<string>) => {
      state.selected.page = 1;
      state.selected.tag = toggle(state.selected.tag, action.payload);
    },
    setRating: (state, action: PayloadAction<number>) => {
      state.selected.page = 1;
      state.selected.rating = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.selected.page = action.payload;
    },
    clearFilters: (state) => {
      if (!state.available) return;
      state.selected = {
        category: [],
        brand: [],
        tag: [],
        priceRange: {
          min: state.available.priceRange.min,
          max: state.available.priceRange.max,
        },
        rating: 0,
        page: 1,
      };
      state.sort = "";
      state.search = "";
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const {
  setInitialFilters,
  clearFilters,
  setPriceRange,
  setSortValue,
  toggleCategory,
  toggleBrand,
  toggleTag,
  setPage,
  setRating,
  setSearch,
  setAvailableFilters,
  setCategory,
} = filterSlice.actions;
export default filterSlice.reducer;
