"use client";
import { Dispatch, SetStateAction } from "react";
import { loadRazorpay } from "@/helpers/loadRazorpay";
import { useAuth } from "@/hooks/useAuth";
import { CheckoutOutput, SummaryType } from "@/types/types";
import { useTRPC, useTRPCClient } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginPopup from "../popups/LoginPopup";

interface SummaryProps {
  summary: SummaryType;
  selectedItems: number[];
  setSelectedItems: Dispatch<SetStateAction<number[]>>;
}

const Summary = ({
  summary,
  selectedItems,
  setSelectedItems,
}: SummaryProps) => {
  const trpcClient = useTRPCClient();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const checkoutMutation = useMutation<
    CheckoutOutput, // backend output type
    unknown,
    { cartItemsIds: number[] }
  >({
    mutationFn: (variables) => trpcClient.order.checkout.mutate(variables),
  });
  const startPayment = async () => {
    try {
      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) {
        alert("Razorpay SDK failed to load");
        return;
      }
      alert("Hello");
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
          ondismiss: async () => {
            const res = await trpcClient.order.markOrderPaymentFailed.mutate({
              orderId: data.orderId,
            });

            console.log("res", res);

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
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    await startPayment();
  };

  return (
    <>
      {showLoginModal ? (
        <LoginPopup
          open={showLoginModal}
          mode="modal"
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setSelectedItems([]);
            setShowLoginModal(false);
          }}
        />
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-md sticky top-24 space-y-6 border border-gray-100">
          <h3 className="text-xl font-semibold border-b pb-3">Order Summary</h3>

          <div className="space-y-3 text-gray-700 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${summary.total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>- ${summary.discount.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between items-center">
            <p className="font-semibold text-lg">Total</p>
            <p className="text-xl font-bold">${summary.payable.toFixed(2)}</p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>

            <button className="px-6 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition">
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Summary;
