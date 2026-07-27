import React from "react";
import WishlistButton from "../common/WishlistButton";
import AddToCartButton from "../common/AddToCartButton";
interface ProductActionProps {
  id: number;
  thumbnail: string | null;
}
const ProudctAction = ({ id, thumbnail }: ProductActionProps) => {
  return (
    <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow">
      <WishlistButton id={id} image={thumbnail} />

      <AddToCartButton id={id} image={thumbnail} />
    </div>
  );
};

export default ProudctAction;
