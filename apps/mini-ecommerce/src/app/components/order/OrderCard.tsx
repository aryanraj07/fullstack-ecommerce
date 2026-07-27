import { OrderItem } from "@/types/types";
import Image from "next/image";
import React from "react";
interface OrderCardProps {
  order: OrderItem;
}
const OrderCard = ({ order }: OrderCardProps) => {
  const statusColor =
    order.paymentStatus === "SUCCESS"
      ? "bg-green-100 text-green-700"
      : order.paymentStatus === "FAILED"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700";

  return (
    <div className="border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">
            Order placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p className="font-semibold text-lg">Order #{order.id}</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Total</p>
          <p className="font-bold text-lg">₹{order.totalAmount}</p>
        </div>
      </div>

      {/* Products */}
      <div className="space-y-4">
        {order.items.map((item: any) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative w-20 h-20">
              <Image
                src={item.product.thumbnail}
                alt={item.product.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>

            <div className="flex-1">
              <p className="font-semibold">{item.product.title}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              <p className="text-sm font-medium">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-6">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
        >
          Payment: {order.paymentStatus}
        </span>

        <span className="text-sm font-semibold text-gray-700">
          Status: {order.orderStatus}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
