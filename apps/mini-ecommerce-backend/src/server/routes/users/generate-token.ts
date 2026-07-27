import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
const accessSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
const expires = process.env.ACCESS_TOKEN_EXPIRES;

if (!accessSecret) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined");
}
if (!refreshSecret) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined");
}

if (!expires) {
  throw new Error("ACCESS_TOKEN_EXPIRES is not defined");
}
export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, accessSecret as Secret, {
    expiresIn: (expires as SignOptions["expiresIn"]) || "1d",
  });
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, refreshSecret, { expiresIn: "30d" });
};
