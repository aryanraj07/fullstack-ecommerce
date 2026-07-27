import { Suspense } from "react";
import OrdersList from "./OrdersList";

export default async function OrdersPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      <Suspense fallback={<p>Loading orders...</p>}>
        <OrdersList />
      </Suspense>
    </div>
  );
}
