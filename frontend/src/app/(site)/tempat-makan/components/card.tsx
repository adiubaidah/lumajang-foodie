import { Star } from "lucide-react";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import React from "react";
import Link from "next/link";
import { betterToKm } from "~/lib/utils";

interface CardPlaceProps {
  srcImage: string;
  title: string;
  slug: string;
  rate: number;
  subdistrict: string;
  distance?: number;
}

function CardPlace({
  srcImage,
  title,
  rate,
  subdistrict,
  slug,
  distance,
}: CardPlaceProps) {
  // return distance;
  return (
    <Link
      href={`/tempat-makan/${slug}`}
      className="block transition duration-200 hover:shadow-lg p-2.5 rounded-2xl"
    >
      <div>
        <SkeletonImage
          src={srcImage}
          alt={title}
          height={200}
          width={200}
          className="rounded-2xl w-full h-[248px] object-cover"
          skeletonStyle={{ borderRadius: 12 }}
        />
        <div className="flex items-center justify-between">
          <h4 className="font-helvetica text-2xl text-davy">{title}</h4>
          <span className="flex bg-orange items-center text-white px-1 rounded-md">
            <span className="text-[17px] font-semibold leading-4">{rate}</span>
            <Star size={12} color="white" colorRendering={"white"} />
          </span>
        </div>
        <p className="font-helvetica font-thin text-[16px] text-davy">
          {subdistrict}
        </p>
      </div>
      {!!distance && (
        <span className="inline-block font-thin text-davy">
          {betterToKm(distance)}
          {/* {distance} */}
        </span>
      )}
    </Link>
  );
}

export default CardPlace;
