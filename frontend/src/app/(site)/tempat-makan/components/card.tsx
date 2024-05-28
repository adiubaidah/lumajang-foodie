import React from "react";
import Link from "next/link";

import { Star } from "~/icons";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { betterToKm, cn, imageFromBackend } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { rateColor } from "~/constant";

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
      className="block transition duration-200 p-2.5 rounded-2xl shadow-[0px_4px_7.3px_0px_rgba(0,0,0,0.2)]"
    >
      <div>
        <SkeletonImage
          src={imageFromBackend(srcImage)}
          alt={title}
          height={200}
          width={200}
          className="rounded-2xl w-full h-[248px] object-cover"
          skeletonStyle={{ borderRadius: 12, width: "100%", height: 248 }}
        />
        <div className="flex items-center justify-between mt-1">
          <h4 className="font-helvetica text-2xl text-davy">{title}</h4>
          <Badge
            className={cn(
              "flex items-center text-white px-2 py-1 rounded-md",
              "hover:bg-",
              !!rate
                ? `bg-[${rateColor[Math.ceil(rate)]}]`
                : "border-orange border-2 bg-orange/20"
            )}
          >
            {!!rate ? (
              <React.Fragment>
                <Star width={17} height={17} fill="white" />
                <span className="text-[12px] font-semibold leading-4 font-helvetica">
                  4.0
                </span>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Star width={17} height={17} fill="#F97300" />
                <span className="text-[12px] font-bold leading-4 font-helvetica text-orange">
                  New
                </span>
              </React.Fragment>
            )}
          </Badge>
        </div>
        <p className="font-helvetica font-thin text-[16px] text-davy">
          {subdistrict}
        </p>
      </div>
      {!!distance && (
        <span className="inline-block font-thin text-davy text-right w-full">
          {betterToKm(distance)}
        </span>
      )}
    </Link>
  );
}

export default CardPlace;
