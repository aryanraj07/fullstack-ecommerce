import { prisma } from "@repo/db/client";

import jwt from "jsonwebtoken";
import { PrismaClient } from "@repo/db/client";
type test = PrismaClient;
export async function getUserFromToken(token?: string) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      userId: number;
    };

    return prisma.user.findUnique({
      where: { id: decoded.userId },
    });
  } catch {
    return null;
  }
}
