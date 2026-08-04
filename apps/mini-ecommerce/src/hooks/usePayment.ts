"use client";

import { useMutation } from "@tanstack/react-query";
import { CheckoutOutput } from "@/types/types";
import { loadRazorpay } from "@/helpers/loadRazorpay";
import { useTRPCClient } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./useAuth";
import { log } from "console";
export default function usePayment() {
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const trpcClient = useTRPCClient();
  const checkoutMutation = useMutation<
    CheckoutOutput, // backend output type
    unknown,
    { cartItemsIds: number[] }
  >({
    mutationFn: (variables) => trpcClient.order.checkout.mutate(variables),
  });
  const startPayment = async (selectedItems: number[]) => {
    try {
      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) {
        alert("Razorpay SDK failed to load");
        return;
      }

      const data = await checkoutMutation.mutateAsync({
        cartItemsIds: selectedItems,
      });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpayOrderId,

        handler: function () {
          router.push(`/orders/${data.orderId}`);
        },

        modal: {
          ondismiss: function () {
            router.push(`/orders/${data.orderId}`);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Payment failed. Check the console.");
    }
  };
  const handleCheckout = async (selectedItems: number[]) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    await startPayment(selectedItems);
  };
  return { showLoginModal, handleCheckout, setShowLoginModal };
}
