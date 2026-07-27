import z from "zod";
export declare const userRoleEnum: z.ZodEnum<{
    USER: "USER";
    ADMIN: "ADMIN";
}>;
export declare const userModel: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodNullable<z.ZodString>;
    email: z.ZodNullable<z.ZodString>;
    phoneNumber: z.ZodString;
    isVerified: z.ZodDefault<z.ZodBoolean>;
    role: z.ZodDefault<z.ZodEnum<{
        USER: "USER";
        ADMIN: "ADMIN";
    }>>;
    createdAt: z.ZodDate;
}, z.core.$strip>;
export declare const otpModel: z.ZodObject<{
    id: z.ZodNumber;
    phoneNumber: z.ZodString;
    otpHashed: z.ZodString;
    expiresAt: z.ZodDate;
    attempts: z.ZodDefault<z.ZodNumber>;
    createdAt: z.ZodDate;
}, z.core.$strip>;
export declare const sendOtpSchema: z.ZodObject<{
    phoneNumber: z.ZodString;
}, z.core.$strip>;
export declare const verifyOtpSchema: z.ZodObject<{
    phoneNumber: z.ZodString;
    otp: z.ZodString;
}, z.core.$strip>;
export declare const simpleMessageResponse: z.ZodObject<{
    message: z.ZodString;
}, z.core.$strip>;
export declare const getUser: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodNullable<z.ZodString>;
        email: z.ZodNullable<z.ZodString>;
        phoneNumber: z.ZodString;
        isVerified: z.ZodDefault<z.ZodBoolean>;
        role: z.ZodDefault<z.ZodEnum<{
            USER: "USER";
            ADMIN: "ADMIN";
        }>>;
        createdAt: z.ZodDate;
    }, z.core.$strip>;
}, z.core.$strip>;
