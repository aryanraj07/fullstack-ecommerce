import { z } from "zod";
export declare const orderItemSchema: z.ZodObject<{
    id: z.ZodNumber;
    orderId: z.ZodNumber;
    productId: z.ZodNumber;
    quantity: z.ZodNumber;
    cartItemId: z.ZodNumber;
    price: z.ZodNumber;
    product: z.ZodObject<{
        id: z.ZodNumber;
        title: z.ZodString;
        thumbnail: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const orderSchema: z.ZodObject<{
    id: z.ZodNumber;
    userId: z.ZodNumber;
    totalAmount: z.ZodNumber;
    paymentStatus: z.ZodEnum<{
        PENDING: "PENDING";
        SUCCESS: "SUCCESS";
        FAILED: "FAILED";
    }>;
    paymentId: z.ZodNullable<z.ZodString>;
    orderStatus: z.ZodEnum<{
        CREATED: "CREATED";
        CONFIRMED: "CONFIRMED";
        SHIPPED: "SHIPPED";
        DELIVERED: "DELIVERED";
        CANCELLED: "CANCELLED";
    }>;
    createdAt: z.ZodDate;
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        orderId: z.ZodNumber;
        productId: z.ZodNumber;
        quantity: z.ZodNumber;
        cartItemId: z.ZodNumber;
        price: z.ZodNumber;
        product: z.ZodObject<{
            id: z.ZodNumber;
            title: z.ZodString;
            thumbnail: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const myOrdersResponse: z.ZodArray<z.ZodObject<{
    id: z.ZodNumber;
    userId: z.ZodNumber;
    totalAmount: z.ZodNumber;
    paymentStatus: z.ZodEnum<{
        PENDING: "PENDING";
        SUCCESS: "SUCCESS";
        FAILED: "FAILED";
    }>;
    paymentId: z.ZodNullable<z.ZodString>;
    orderStatus: z.ZodEnum<{
        CREATED: "CREATED";
        CONFIRMED: "CONFIRMED";
        SHIPPED: "SHIPPED";
        DELIVERED: "DELIVERED";
        CANCELLED: "CANCELLED";
    }>;
    createdAt: z.ZodDate;
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        orderId: z.ZodNumber;
        productId: z.ZodNumber;
        quantity: z.ZodNumber;
        cartItemId: z.ZodNumber;
        price: z.ZodNumber;
        product: z.ZodObject<{
            id: z.ZodNumber;
            title: z.ZodString;
            thumbnail: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>>;
}, z.core.$strip>>;
export declare const checkoutResponse: z.ZodObject<{
    orderId: z.ZodNumber;
    razorpayOrderId: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodString;
    key: z.ZodString;
}, z.core.$strip>;
