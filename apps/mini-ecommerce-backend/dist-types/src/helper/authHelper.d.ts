export declare function getUserFromToken(token?: string): Promise<{
    id: number;
    phoneNumber: string;
    name: string | null;
    email: string | null;
    isVerified: boolean;
    role: import("@prisma/client").$Enums.UserRole;
    createdAt: Date;
} | null>;
