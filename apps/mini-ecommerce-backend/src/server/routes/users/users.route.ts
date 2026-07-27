import { protectedProcedure, publicProcedure, router } from "../../trpc.js";
import { CookieOptions } from "express";
import {
  getUser,
  sendOtpSchema,
  simpleMessageResponse,
  verifyOtpSchema,
} from "./model.js";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { generateAccessToken, generateRefreshToken } from "./generate-token.js";
import jwt from "jsonwebtoken";
const isProd = process.env.NODE_ENV === "production";
const clearCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
};
export const userRouter = router({
  sendOtp: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/send-otp",
        tags: ["User"],
        description: "Send otp to user while logging in",
      },
    })
    .input(sendOtpSchema)
    .output(simpleMessageResponse)
    .mutation(async ({ input, ctx }) => {
      const { phoneNumber } = input;
      const otp = "666666";
      const hashedOtp = await bcrypt.hash(otp, 10);
      await ctx.prisma.otp.deleteMany({
        where: {
          phoneNumber,
        },
      });
      // crate new otp
      await ctx.prisma.otp.create({
        data: {
          phoneNumber,
          otpHashed: hashedOtp,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      });
      //   TODO Send sms here
      return {
        message: "Otp sent successfully",
      };
    }),
  verifyOtp: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/verify-otp",
        tags: ["User"],
        description: "Verify otp ",
      },
    })
    .input(verifyOtpSchema)
    .output(simpleMessageResponse)
    .mutation(async ({ input, ctx }) => {
      const { phoneNumber, otp } = input;
      const otpRecord = await ctx.prisma.otp.findFirst({
        where: {
          phoneNumber,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      if (!otpRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "OTP not found",
        });
      }

      if (otpRecord.expiresAt < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "OTP expired",
        });
      }
      const isValid = await bcrypt.compare(otp, otpRecord.otpHashed);
      if (!isValid) {
        await ctx.prisma.otp.update({
          where: {
            id: otpRecord.id,
          },
          data: {
            attempts: {
              increment: 1,
            },
          },
        });
        throw new TRPCError({
          code: "BAD_GATEWAY",
          message: "Invalid OTP",
        });

        // After success delete otp
      }
      await ctx.prisma.otp.deleteMany({
        where: {
          phoneNumber,
        },
      });
      const user = await ctx.prisma.user.upsert({
        where: {
          phoneNumber,
        },
        update: {
          isVerified: true,
        },
        create: {
          phoneNumber,
          isVerified: true,
        },
      });
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
      await ctx.prisma.session.create({
        data: {
          userId: user.id,
          refreshToken,
        },
      });
      // set cookies
      // secure way
      // ctx.res.cookie("accessToken", accessToken, {
      //   httpOnly: true,
      //   secure: false,
      //   sameSite: "lax",
      //   maxAge: 1 * 60 * 1000,
      // });
      // ctx.res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   secure: false,
      //   sameSite: "lax",
      //   maxAge: 30 * 24 * 60 * 60 * 1000,
      // });

      ctx.res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
      ctx.res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      ctx.res.clearCookie("guestId", clearCookieOptions);
      return {
        message: "Login successful",
      };
    }),
  me: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/me",
        tags: ["User"],
        description: "Get the user details",
      },
    })
    .output(getUser)
    .query(async ({ ctx }) => {
      return {
        user: ctx.user,
      };
    }),
  refresh: publicProcedure.mutation(async ({ ctx }) => {
    const refreshToken = ctx.req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
      ) as { userId: number };
      // check session
      const session = await ctx.prisma.session.findUnique({
        where: {
          refreshToken,
        },
      });

      if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const newAccessToken = generateAccessToken(payload.userId);
      const isProd = process.env.NODE_ENV === "production";
      ctx.res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
    } catch (err) {
      console.log("JWT VERIFY ERROR:", err);
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
  }),
  logout: protectedProcedure
    .meta({
      openapi: {
        path: "/logout",
        method: "GET",
        description: "Logging out the user",
        tags: ["USER"],
      },
    })
    .output(simpleMessageResponse)
    .mutation(async ({ ctx }) => {
      const refreshToken = await ctx.req.cookies?.refreshToken;
      if (refreshToken) {
        await ctx.prisma.session.deleteMany({
          where: {
            refreshToken,
          },
        });
      }

      ctx.res.clearCookie("accessToken", clearCookieOptions);
      ctx.res.clearCookie("refreshToken", clearCookieOptions);
      return { message: "Logged out" };
    }),
});
// me:
//refresh //logout
