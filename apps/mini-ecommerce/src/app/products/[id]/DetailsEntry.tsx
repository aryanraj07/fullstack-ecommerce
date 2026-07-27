import ProductDesc from "@/app/components/productDetails/ProductDesc";
import RelatedProducts from "@/app/components/productDetails/RelatedProducts";
//
import { createPublicTRPCClient } from "@/utils/fetchServerData";
const DetailsEntry = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const trpc = createPublicTRPCClient();

  const [data, relatedProducts] = await Promise.all([
    trpc.products.getSingleProduct.query({ id }),
    trpc.products.getSimilarProducts.query({ productId: Number(id) }),
  ]);
  return (
    <div className="max-w-7xl mx-auto p-6 ">
      <ProductDesc product={data.product} />
      <RelatedProducts relatedProducts={relatedProducts.products} />
    </div>
  );
};

export default DetailsEntry;
