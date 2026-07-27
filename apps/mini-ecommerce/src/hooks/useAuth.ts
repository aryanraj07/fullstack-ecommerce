"use client";

import { User } from "@/types/types";
import { useTRPC } from "@/utils/trpc";
import { useQuery, useMutation } from "@tanstack/react-query";

export const useAuth = () => {
  const trpc = useTRPC();

  const meQuery = useQuery(
    trpc.users.me.queryOptions(undefined, {
      retry: false,
      staleTime: 5 * 60 * 1000,
    }),
  );

  const refreshMutation = useMutation(trpc.users.refresh.mutationOptions());

  const isLoading = meQuery.isLoading;
  const user = meQuery.data?.user ?? null;
  const isAuthenticated = !!user;

  return {
    user,
    isAuthenticated,
    isLoading,
    refetch: meQuery.refetch,
    refresh: refreshMutation.mutateAsync,
  };
};
