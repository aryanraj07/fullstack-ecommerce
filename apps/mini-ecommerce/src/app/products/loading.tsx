import ProductSkeleton from "../components/skelton/ProductSkelton";

export default function Loading() {
  return (
    <div className="container-custom">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-content-center">
        {[...Array(8)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
