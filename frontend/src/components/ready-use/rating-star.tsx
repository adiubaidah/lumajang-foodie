import { SetStateAction, useState } from "react";
import { Star } from "~/icons";

interface RatingStarProps {
  rating: number;
  setRating: React.Dispatch<SetStateAction<number>>;
}

export function RatingStar({ rating, setRating }: RatingStarProps) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star, index) => {
        return (
          <button
            key={index}
            type="button"
            onClick={() => {
              setRating(star);
            }}
          >
            <Star width={40} height={40} fill={rating >= star ? '#F97300' : 'black'} />
          </button>
        );
      })}
    </div>
  );
}
