export type DropdownOption = {
  label: string;
  value: string;
};
export const sortedOptions: DropdownOption[] = [
  { label: "Price Low to High", value: "price_asc" },
  { label: "Price High to Low", value: "price_desc" },
  { label: "Highest Rated", value: "rating_desc" },
  { label: "Newest", value: "newest" },
];
