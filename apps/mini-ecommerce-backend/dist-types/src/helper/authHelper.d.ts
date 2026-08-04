export declare function getUserFromToken(token?: string): Promise<{
    id: number;
    name: string | null;
    email: string | null;
    isVerified: boolean;
    role: import("@repo/db/client").UserRole;
    phoneNumber: string;
    createdAt: Date;
} | null>;
