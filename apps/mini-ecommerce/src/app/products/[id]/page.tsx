import DetailsEntry from "@/app/products/[id]/DetailsEntry";
interface PageProps {
  params: Promise<{ id: string }>;
}

const ProductDetailsPage = ({ params }: PageProps) => {
  return <DetailsEntry params={params} />;
};

export default ProductDetailsPage;
