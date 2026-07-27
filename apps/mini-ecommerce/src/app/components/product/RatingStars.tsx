import React from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const RatingStars = ({ rating }: { rating: number }) => {
  const fullStar = Math.floor(rating);
  const decimal = rating - fullStar;
  const halfStar = decimal >= 0.25 && decimal <= 0.75;
  const emptyStar = 5 - fullStar - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center gap-1 rating">
      {Array(fullStar)
        .fill(0)
        .map((_, i) => (
          <div key={i}>
            <FaStar className="text-yellow-500" />
          </div>
        ))}
      {halfStar && <FaStarHalfAlt className="text-yellow-500" />}
      {Array(emptyStar)
        .fill(0)
        .map((_, i) => (
          <div key={i}>
            <FaRegStar />
          </div>
        ))}
    </div>
  );
};

export default RatingStars;
