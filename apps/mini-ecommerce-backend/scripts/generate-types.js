import fs from "fs";
import path from "path";
const content = `
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { appRouter } from "./server/index.js";

export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
`;
fs.writeFileSync(path.join(process.cwd(), "dist/types.d.ts"), content);
console.log("✅ types.d.ts generated");
//# sourceMappingURL=generate-types.js.map