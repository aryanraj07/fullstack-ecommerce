// import { createTRPCReact } from "@trpc/react-query";
import { createTRPCContext } from "@trpc/tanstack-react-query";
// import type { AppRouter } from "api-types";
// import type { AppRouter } from "@backend/server";
import type { AppRouter } from "@repo/api-types";
export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();
