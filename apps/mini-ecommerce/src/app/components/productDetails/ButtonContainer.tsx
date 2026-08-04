"use client";
import React, { useState } from "react";
import AddToCartButton from "../common/AddToCartButton";
import { useAppDispatch } from "@/hooks/hooks";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import usePayment from "@/hooks/usePayment";
import LoginPopup from "../popups/LoginPopup";
import { useTRPCClient } from "@/utils/trpc";
import { useAuth } from "@/hooks/useAuth";
import { loadRazorpay } from "@/helpers/loadRazorpay";
import { useMutation } from "@tanstack/react-query";

const ButtonContainer = ({ id, image }: { id: number; image: string }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const trpcClient = useTRPCClient();
  const buyNowMutation = useMutation({
    mutationFn: (variables: { productId: number; quantity: number }) =>
      trpcClient.order.checkoutBuyNow.mutate(variables),
  });
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    const sdkLoaded = await loadRazorpay();
    if (!sdkLoaded) {
      alert("Razorpay SDK failed to load");
      return;
    }
    const data = await buyNowMutation.mutateAsync({
      productId: id,
      quantity: 1,
    });
    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      order_id: data.razorpayOrderId,

      handler() {
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
  };

  // const dispatch = useAppDispatch();
  // const showCustomToast = (
  //   message: string,
  //   img: string,
  //   onClick: () => void,
  // ) => {
  //   toast.custom((t) => (
  //     <div
  //       onClick={() => {
  //         toast.dismiss(t.id);
  //         onClick();
  //       }}
  //       className={`${
  //         t.visible ? "animate-toast-in" : "animate-toast-out"
  //       } flex items-center gap-3 cursor-pointer
  //     bg-white border border-gray-200 rounded-xl shadow-md
  //     px-3 py-3 w-60 sm:w-[300px]
  //     transition-all hover:shadow-lg`}
  //     >
  //       <div className="relative w-10 h-10 bg-gray-100 rounded-md shadow-sm">
  //         <Image src={img} alt="img" fill className="object-contain" />
  //       </div>

  //       <div className="flex flex-col text-xs sm:text-sm text-gray-900 leading-tight">
  //         <span className="font-medium">{message}</span>
  //         <span className="text-blue-600 underline pt-1">Tap to view →</span>
  //       </div>
  //     </div>
  //   ));
  // };

  return (
    <>
      <div className="btn-container flex items-center gap-3 p-2">
        {/* <button
        className="px-6 py-3 bg-black text-white rounded-md  hover:bg-gray-700 transition"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button> */}
        <AddToCartButton id={id} image={image} />

        <button
          className=" px-6 py-3 bg-black text-white rounded-md  hover:bg-gray-700 transition"
          onClick={() => handleBuyNow()}
        >
          Buy Now
        </button>
      </div>
      {showLoginModal && (
        <LoginPopup
          open={showLoginModal}
          mode="modal"
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            // setSelectedItems([]);
            setShowLoginModal(false);
          }}
        />
      )}
    </>
  );
};

export default ButtonContainer;
