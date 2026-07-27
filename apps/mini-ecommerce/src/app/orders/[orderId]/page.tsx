import { Suspense } from "react";
import OrderSinglePage from "./OrderSinglePage";

interface PageProps {
  params: { orderId: string };
}

export default async function Page({ params }: PageProps) {
  const { orderId } = await params;

  return (
    <Suspense fallback={<p className="p-8">Loading order...</p>}>
      <OrderSinglePage orderId={orderId} />
    </Suspense>
  );
}
