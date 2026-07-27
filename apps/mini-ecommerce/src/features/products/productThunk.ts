import { createAsyncThunk } from "@reduxjs/toolkit";

// export const fetchFilterdProducts = createAsyncThunk(
//   "products/filteredProucts",
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState().products;
//       const filters = getState().filter;
//       const { priceRange, categories } = filters.selected;
//       const { searchQuery, sortValue } = filters;
//       const { min, max } = priceRange;
//       const { page } = state;

//       const params = new URLSearchParams({
//         page: page.toString(),
//         ...(searchQuery && { query: searchQuery }),
//       });
//       if (categories.length) {
//         params.set("category", categories.join(","));
//       }

//       if (sortValue) {
//         params.set("sorting", sortValue);
//       }
//       if (min > 0 && max > 0) {
//         params.set("min", min.toString());
//         params.set("max", max.toString());
//       }
//       const res = await fetch(`api/products?${params}`);
//       if (!res.ok) {
//         const text = await res.text();
//         return rejectWithValue(text || "API failed");
//       }
//       return await res.json();
//     } catch (err) {
//       console.log(err.stack);
//       return rejectWithValue(err);
//     }
//   },
// );
