import "dotenv/config";
import { prisma } from "@repo/db/client";

import * as trpcExpress from "@trpc/server/adapters/express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { getUserFromToken } from "../helper/authHelper.js";
const isProd = process.env.NODE_ENV === "production";

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  let user = null;
  const token = req.cookies?.accessToken;
  user = await getUserFromToken(token);

  let guestId = req.cookies?.guestId;

  if (!user && !guestId) {
    guestId = randomUUID();

    res.cookie("guestId", guestId, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
  }
  return { prisma, user, req, res, guestId };
}; // no contextp
export type Context = Awaited<ReturnType<typeof createContext>>;
