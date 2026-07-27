"use client";
import Summary from "./Summary";

import { UpdateCartInput, RemoveCartInput, CartSummary } from "@/types/types";
import { useTRPC, useTRPCClient } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CartItem } from "@/types/types";
import CartItemCard from "./CartItemCard";
import { useEffect, useState } from "react";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useAuth } from "@/hooks/useAuth";
type CartQueryData = {
  cartItem: CartItem[];
};
type RemoveContext = {
  previousCart?: CartQueryData;
  previousSelected?: number[];
};
const Cart = () => {
  const trpc = useTRPC();
  const { user } = useAuth();
  const trpcClient = useTRPCClient();
  const cartQuery = trpc.cartItem.getCart.queryOptions();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  // alert(selectedItems.length);

  const { data: summaryData } = useQuery(
    trpc.cartItem.getCartSummary.queryOptions(
      { cartItemIds: selectedItems },
      { enabled: selectedItems.length > 0 },
    ),
  );
  const summary = summaryData as CartSummary | undefined;
  const handleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const queryClient = useQueryClient();

  const invalidateCartAndSummary = () => {
    queryClient.invalidateQueries(cartQuery);
    queryClient.invalidateQueries({
      queryKey: trpc.cartItem.getCartSummary.queryKey(),
    });
  };

  const { data } = useQuery(cartQuery);

  const addMutation = useAddToCart();
  const updateMutation = useMutation<
    { message: string },
    unknown,
    UpdateCartInput,
    { previousCart?: CartQueryData }
  >({
    mutationFn: (variables) =>
      trpcClient.cartItem.updateQuantity.mutate(variables),

    async onMutate(variables) {
      await queryClient.cancelQueries(cartQuery);

      const previousCart = queryClient.getQueryData(cartQuery.queryKey);

      queryClient.setQueryData(
        cartQuery.queryKey,
        (old: CartQueryData | undefined) => {
          if (!old) return old;

          return {
            ...old,
            cartItem: old.cartItem.map((item) =>
              item.id === variables.cartItemId
                ? { ...item, quantity: variables.quantity ?? item.quantity }
                : item,
            ),
          };
        },
      );

      return { previousCart };
    },

    onError(_error, _variables, context) {
      if (context?.previousCart) {
        queryClient.setQueryData(cartQuery.queryKey, context.previousCart);
      }
    },

    onSettled() {
      invalidateCartAndSummary();
    },
  });

  const removeMutation = useMutation<
    { message: string },
    unknown,
    RemoveCartInput,
    RemoveContext
  >({
    mutationFn: (variables) =>
      trpcClient.cartItem.removeFromCart.mutate(variables),

    async onMutate(variables) {
      await queryClient.cancelQueries(cartQuery);

      const previousCart = queryClient.getQueryData(cartQuery.queryKey);
      const previousSelected = selectedItems;

      queryClient.setQueryData(
        cartQuery.queryKey,
        (old: CartQueryData | undefined) => {
          if (!old) return old;

          return {
            ...old,
            cartItem: old.cartItem.filter(
              (item) => item.id !== variables.cartItemId,
            ),
          };
        },
      );

      setSelectedItems((prev) =>
        prev.filter((id) => id !== variables.cartItemId),
      );

      return { previousCart, previousSelected };
    },

    onError(_error, _variables, context) {
      if (context?.previousCart) {
        queryClient.setQueryData(cartQuery.queryKey, context.previousCart);
      }

      if (context?.previousSelected) {
        setSelectedItems(context.previousSelected);
      }
    },

    onSettled() {
      invalidateCartAndSummary();
    },
  });
  const cartItems = (data as CartQueryData | undefined)?.cartItem ?? [];

  return (
    <div className="container-custom py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="cart-items w-full lg:w-3/4 bg-white p-6 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold mb-6">
            Cart # <span>{cartItems?.length} items</span>
          </h1>
          {cartItems?.length === 0 ? (
            <p className="text-center text-gray-500 py-2">
              Your cart is empty{" "}
            </p>
          ) : (
            <ul className="cart-items-wrapper space-y-4">
              {cartItems?.map((item: CartItem) => (
                <li key={item.id}>
                  <CartItemCard
                    item={item}
                    onIncrease={() =>
                      addMutation.mutate({
                        productId: item.productId,
                        quantity: 1,
                      })
                    }
                    onDecrease={() => {
                      if (item.quantity === 1) {
                        removeMutation.mutate({
                          cartItemId: item.id,
                        });
                      } else {
                        updateMutation.mutate({
                          cartItemId: item.id,
                          quantity: item.quantity - 1,
                        });
                      }
                    }}
                    onRemove={() =>
                      removeMutation.mutate({
                        cartItemId: item.id,
                      })
                    }
                    selectedItems={selectedItems}
                    onSelectItem={handleSelect}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
        {summary && (
          <div className="cart-items lg:w-1/4 ">
            <Summary
              summary={summary}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
