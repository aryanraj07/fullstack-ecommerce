import { promiseHooks } from "node:v8";
import z from "zod";

export const userRoleEnum = z.enum(["USER", "ADMIN"]);
export const userModel = z.object({
  id: z.number().int(),
  name: z.string().nullable().describe("Name of the user"),
  email: z.string().email().nullable().describe("Email of the user"),
  phoneNumber: z.string().max(10).describe("Phone number of the user"),
  isVerified: z.boolean().default(false),
  role: userRoleEnum.default("USER"),
  createdAt: z.date(),
});
export const otpModel = z.object({
  id: z.number().int(),

  phoneNumber: z.string().min(10).max(15).describe("Phone number of the user"),

  otpHashed: z.string().describe("Hashed OTP stored in DB"),

  expiresAt: z.date(),

  attempts: z.number().int().default(0),

  createdAt: z.date(),
});
const indianPhoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number");
export const sendOtpSchema = z.object({
  phoneNumber: indianPhoneSchema,
});
export const verifyOtpSchema = z.object({
  phoneNumber: indianPhoneSchema,
  otp: z.string().length(6),
});
export const simpleMessageResponse = z.object({
  message: z.string(),
});
export const getUser = z.object({
  user: userModel,
});
