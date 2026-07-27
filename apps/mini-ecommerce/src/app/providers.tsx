"use client";
import { Provider } from "react-redux";
import { store } from "./store";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { TRPCProvider } from "@/utils/trpc";
import React, { useEffect, useState } from "react";
import type { AppRouter } from "@repo/api-types";
// This code is only for TypeScript

// declare global {
//   interface Window {
//     __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
//   }
// }
//
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
        // staleTime: 1000,
        refetchOnWindowFocus: false,
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        // staleTime: 60 * 1000,
      },
    },
  });
}
export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_API_URL}/trpc`,
          // url: "http://localhost:8000/trpc",
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
        }),
      ],
    }),
  );
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     window.__TANSTACK_QUERY_CLIENT__ = queryClient;
  //   }
  // }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <Provider store={store}>
          {children}

          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2000,
              style: {
                background: "#222",
                color: "#fff",
                borderRadius: "12px",
                fontSize: "14px",
              },
            }}
          />
        </Provider>
      </TRPCProvider>
      <ReactQueryDevtools initialIsOpen position="right" />
    </QueryClientProvider>
  );
}
