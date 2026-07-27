import ProductPageClient from "@/app/components/product/ProductPageClient";
import { getProducts } from "@/helpers/getProducts";
import MobileFilterBar from "../components/product/MobileFilterBar";

export default async function Page() {
  const initialData = await getProducts();
  return (
    <div className="container-custom">
      <ProductPageClient initialData={initialData} />
      <div className="fixed bottom-1">
        <MobileFilterBar />
      </div>
    </div>
  );
}
