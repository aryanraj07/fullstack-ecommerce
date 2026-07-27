export interface ProductConfigType {
  brands: string[];
  imageQuery: string;
  basePrice: {
    min: number;
    max: number;
  };
  colors?: string[];
  sizes?: string[];
  storage?: string[];
}

export const productConfig: Record<string, ProductConfigType> = {
  mobiles: {
    brands: ["Apple", "Samsung", "OnePlus", "Nothing", "Realme"],
    storage: ["128GB", "256GB", "512GB"],
    colors: ["Black", "Blue", "Silver", "White"],
    imageQuery: "modern smartphone clean background",
    basePrice: { min: 20000, max: 120000 },
  },

  headphones: {
    brands: ["Sony", "Boat", "JBL"],
    colors: ["Black", "White"],
    imageQuery: "wireless headphones studio lighting",
    basePrice: { min: 1500, max: 15000 },
  },

  "men-tshirts": {
    brands: ["Nike", "Adidas", "Puma"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Red", "Blue"],
    imageQuery: "men tshirt product photography",
    basePrice: { min: 499, max: 2999 },
  },

  "women-dresses": {
    brands: ["Zara", "H&M"],
    sizes: ["S", "M", "L"],
    colors: ["Red", "Pink", "Black"],
    imageQuery: "women dress product photography",
    basePrice: { min: 999, max: 5999 },
  },

  perfumes: {
    brands: ["Dior", "Gucci", "Armani"],
    sizes: ["50ml", "100ml", "150ml"],
    imageQuery: "luxury perfume bottle product shot",
    basePrice: { min: 2000, max: 15000 },
  },

  "water-bottles": {
    brands: ["Milton", "Cello"],
    sizes: ["500ml", "750ml", "1000ml", "1200ml"],
    colors: ["Blue", "Black", "Steel"],
    imageQuery: "steel water bottle product photography",
    basePrice: { min: 299, max: 1999 },
  },
};
