// hooks/useWishlist.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPCClient, useTRPC } from "@/utils/trpc";
import { AddToWishlist, RemoveWishlist, WishlistItem } from "@/types/types";

export const useWishlist = () => {
  const trpcClient = useTRPCClient();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const wishlistQueryKey = trpc.wishlistItems.getWishlist.queryKey();

  // ---------------- ADD ----------------
  const addToWishlist = useMutation<
    { message: string },
    unknown,
    AddToWishlist,
    { previousWishlist?: WishlistItem }
  >({
    mutationFn: (variables) =>
      trpcClient.wishlistItems.addToWishlist.mutate(variables),

    async onMutate(variables) {
      await queryClient.cancelQueries({ queryKey: wishlistQueryKey });

      const previousWishlist =
        queryClient.getQueryData<WishlistItem>(wishlistQueryKey);

      queryClient.setQueryData(wishlistQueryKey, (old) => {
        const current = old ?? [];

        // avoid duplicates
        if (current.includes(variables.productId)) return current;

        return [...current, variables.productId];
      });

      return { previousWishlist };
    },

    onError(_err, _vars, context) {
      if (context?.previousWishlist) {
        queryClient.setQueryData(wishlistQueryKey, context.previousWishlist);
      }
    },

    onSettled() {
      queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
    },
  });

  // ---------------- REMOVE ----------------
  const removeFromWishlist = useMutation<
    { message: string },
    unknown,
    RemoveWishlist,
    { previousWishlist?: WishlistItem }
  >({
    mutationFn: (variables) =>
      trpcClient.wishlistItems.removeFromWishList.mutate(variables),

    async onMutate(variables) {
      await queryClient.cancelQueries({ queryKey: wishlistQueryKey });

      const previousWishlist =
        queryClient.getQueryData<WishlistItem>(wishlistQueryKey);

      queryClient.setQueryData(
        wishlistQueryKey,
        (old: WishlistItem | undefined) => {
          if (!old) return old;

          return old.filter((item) => item !== variables.productId);
        },
      );

      return { previousWishlist };
    },

    onError(_err, _vars, context) {
      if (context?.previousWishlist) {
        queryClient.setQueryData(wishlistQueryKey, context.previousWishlist);
      }
    },

    onSettled() {
      queryClient.invalidateQueries({ queryKey: wishlistQueryKey });
    },
  });

  return { addToWishlist, removeFromWishlist };
};
