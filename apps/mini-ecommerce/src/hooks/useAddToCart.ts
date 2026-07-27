// hooks/useAddToCart.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPCClient, useTRPC } from "@/utils/trpc";
import { AddToCartInput, CartItem } from "@/types/types";

type CartQueryData = {
  cartItem: CartItem[];
};

export const useAddToCart = () => {
  const trpcClient = useTRPCClient();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const cartQueryKey = trpc.cartItem.getCart.queryKey();

  return useMutation<
    { message: string },
    unknown,
    AddToCartInput,
    { previousCart?: CartQueryData }
  >({
    mutationFn: (variables) => trpcClient.cartItem.addToCart.mutate(variables),

    async onMutate(variables) {
      await queryClient.cancelQueries({ queryKey: cartQueryKey });

      const previousCart = queryClient.getQueryData(cartQueryKey);

      queryClient.setQueryData(
        cartQueryKey,
        (old: CartQueryData | undefined) => {
          if (!old) return old;
          //

          return {
            ...old,
            cartItem: old.cartItem.map((item) =>
              item.productId === variables.productId
                ? {
                    ...item,
                    quantity: item.quantity + (variables.quantity ?? 1),
                  }
                : item,
            ),
          };
        },
      );

      return { previousCart };
    },

    onError(_error, _variables, context) {
      if (context?.previousCart) {
        queryClient.setQueryData(cartQueryKey, context.previousCart);
      }
    },

    onSettled() {
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
  });
};
