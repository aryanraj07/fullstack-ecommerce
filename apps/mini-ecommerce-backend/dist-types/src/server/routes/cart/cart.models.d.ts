import z from "zod";
export declare const cartSummary: z.ZodObject<{
    total: z.ZodNumber;
    discount: z.ZodNumber;
    payable: z.ZodNumber;
}, z.core.$strip>;
export declare const cartItemModel: z.ZodObject<{
    id: z.ZodNumber;
    quantity: z.ZodNumber;
    productId: z.ZodNumber;
    title: z.ZodString;
    price: z.ZodNumber;
    discountPercentage: z.ZodNumber;
    discountedPrice: z.ZodOptional<z.ZodNumber>;
    thumbnail: z.ZodString;
    stock: z.ZodNumber;
    rating: z.ZodNumber;
    brandName: z.ZodString;
}, z.core.$strip>;
export type CartItem = z.infer<typeof cartItemModel>;
export declare const getCartItemsOutput: z.ZodObject<{
    cartItem: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        quantity: z.ZodNumber;
        productId: z.ZodNumber;
        title: z.ZodString;
        price: z.ZodNumber;
        discountPercentage: z.ZodNumber;
        discountedPrice: z.ZodOptional<z.ZodNumber>;
        thumbnail: z.ZodString;
        stock: z.ZodNumber;
        rating: z.ZodNumber;
        brandName: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
