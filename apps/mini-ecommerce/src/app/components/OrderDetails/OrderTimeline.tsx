"use client";

interface Props {
  status: string;
}

const steps = [
  { key: "CREATED", label: "Order Placed" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "DELIVERED", label: "Delivered" },
];

export default function OrderTimeline({ status }: Props) {
  const currentIndex = steps.findIndex((step) => step.key === status);

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <h2 className="font-semibold mb-6">Track Your Order</h2>

      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isActive = index <= currentIndex;

          return (
            <div key={step.key} className="flex-1 text-center relative">
              <div
                className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                  isActive ? "bg-green-600" : "bg-gray-300"
                }`}
              >
                ✓
              </div>

              <p
                className={`mt-2 text-sm ${
                  isActive ? "text-green-600 font-semibold" : "text-gray-500"
                }`}
              >
                {step.label}
              </p>

              {index !== steps.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-1 ${
                    index < currentIndex ? "bg-green-600" : "bg-gray-300"
                  }`}
                  style={{ transform: "translateX(50%)" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
