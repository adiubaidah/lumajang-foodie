import { Star } from "lucide-react";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import React from "react";
import Link from "next/link";

interface CardPlaceProps {
  srcImage: string;
  title: string;
  slug: string;
  rate: number;
  subdistrict: string;
}

function CardPlace({
  srcImage,
  title,
  rate,
  subdistrict,
  slug,
}: CardPlaceProps) {
  return (
    <Link
      href={`/tempat-makan/${slug}`}
      className="block transition duration-200 hover:shadow-lg p-2.5 rounded-2xl"
    >
      <SkeletonImage
        src={srcImage}
        alt={title}
        height={200}
        width={200}
        className="rounded-2xl w-full h-[248px] object-cover"
        skeletonStyle={{ borderRadius: 12 }}
      />
      <div className="flex items-center justify-between">
        <h4>{title}</h4>
        <span className="flex bg-green-700 items-center text-white px-1 rounded-md">
          <span className="text-[17px] font-semibold leading-4">{rate}</span>
          <Star size={12} color="white" colorRendering={"white"} />
        </span>
      </div>
      <p>{subdistrict}</p>
    </Link>
  );
}

export default CardPlace;
