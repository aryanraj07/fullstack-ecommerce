"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import Image from "next/image";
import OrderTimeline from "@/app/components/OrderDetails/OrderTimeline";

import { OrderbyIdOutput, OrderItem, OrderItemItems } from "@/types/types";
interface OrderSinglePageProps {
  orderId: string;
}
type RefetchQuery = {
  state: {
    data?: OrderbyIdOutput;
  };
};
export default function OrderSinglePage({ orderId }: OrderSinglePageProps) {
  const router = useRouter();
  //   const { orderId } = useParams();
  const trpc = useTRPC();
  const shouldRefetch = (data?: OrderbyIdOutput) =>
    data?.paymentStatus === "PENDING" ? 2000 : false;

  const { data, isLoading } = useQuery(
    trpc.order.getOrdderById.queryOptions(
      { orderId: Number(orderId) },
      {
        enabled: !!orderId,
        refetchInterval: (query: RefetchQuery) =>
          shouldRefetch(query.state.data),
      },
    ),
  );
  const order = data as OrderbyIdOutput | undefined;

  if (isLoading)
    return (
      <div className="p-8 animate-pulse text-gray-500">
        Loading order details...
      </div>
    );
  if (!order) return <p className="p-8">Order not found</p>;
  if (order.paymentStatus === "PENDING") {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">Processing your payment...</h2>
        <p className="text-gray-500 mt-2">
          Please wait while we confirm your order.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          <p className="text-sm text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="text-right">
          <p className="text-gray-500 text-sm">Total Amount</p>
          <p className="text-2xl font-bold">₹{order.totalAmount}</p>
        </div>
      </div>

      {/* Order Status Timeline */}
      <OrderTimeline status={order.orderStatus} />

      {/* Products Section */}

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Items in this order</h2>

        <div className="space-y-6">
          {order.items.map((item: OrderItemItems) => (
            <div
              key={item.id}
              className="flex gap-6 border-b pb-6 cursor-pointer"
              onClick={() => router.push(`/products/${item.product.id}`)}
            >
              <div className="relative w-32 h-32">
                <Image
                  src={item.product.thumbnail ?? "/placeholder.png"}
                  alt={item.product.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <div className="flex-1">
                <p className="text-lg font-semibold">{item.product.title}</p>

                <p className="text-gray-500 mt-1">Quantity: {item.quantity}</p>

                <p className="text-gray-500">Price: ₹{item.price}</p>

                <p className="font-semibold mt-2">
                  Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment & Order Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-6">
          <h3 className="font-semibold mb-3">Payment Information</h3>
          <p>Status: {order.paymentStatus}</p>
          <p>Payment ID: {order.paymentId}</p>
        </div>

        <div className="border rounded-xl p-6">
          <h3 className="font-semibold mb-3">Order Status</h3>
          <p>Current Status: {order.orderStatus}</p>
        </div>
      </div>
    </div>
  );
}
