import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@repo/api-types";
export function createPublicTRPCClient() {
  return createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
      }),
    ],
  });
}
export function createServerTRPCClient(cookie: string | null) {
  return createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        // url: "http://localhost:8000/trpc",
        url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            headers: {
              ...options?.headers,
              cookie: cookie ?? "",
            },
          });
        },
      }),
    ],
  });
}
