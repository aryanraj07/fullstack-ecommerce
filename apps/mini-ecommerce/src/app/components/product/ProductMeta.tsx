import { Star } from "lucide-react";

interface ProductMetaProps {
  rating: number | null;
  brandName: string;
}
const ProductMeta = ({ rating, brandName }: ProductMetaProps) => {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="uppercase tracking-wide text-gray-500">{brandName}</span>

      <div className="flex items-center gap-1 text-gray-700">
        <Star size={14} fill="black" />
        <span>{rating?.toFixed(1) ?? 0}</span>
      </div>
    </div>
  );
};

export default ProductMeta;
