import React, { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

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
  // const ref = useRef(null);
  //set trehs
  // const isInView = useInView(ref, { once: true, margin: "" });
  return (
    // <motion.div
    //   ref={ref}
    //   initial={{ scale: 0.9 }}
    //   animate={{ scale: isInView ? 1 : 0 }}
    //   transition={{ duration: 0.5 }}
    // >
    <Link
      href={`/tempat-makan/${slug}`}
      className="block rounded-2xl p-2.5 shadow-[0px_4px_7.3px_0px_rgba(0,0,0,0.2)] transition duration-200"
    >
      <div>
        <SkeletonImage
          src={imageFromBackend(srcImage)}
          alt={title}
          height={200}
          width={200}
          className="h-[248px] w-full rounded-2xl object-cover"
          skeletonStyle={{ borderRadius: 12, width: "100%", height: 248 }}
        />
        <div className="mt-1 flex items-center justify-between">
          <h4 className="font-helvetica text-2xl text-davy">{title}</h4>
          <Badge
            className={cn(
              "flex items-center rounded-md px-2 py-1 text-white",
              "hover:bg-",
              !!rate
                ? `bg-[${rateColor[Math.ceil(rate)]}]`
                : "border-2 border-orange bg-orange/20",
            )}
          >
            {!!rate ? (
              <React.Fragment>
                <Star width={17} height={17} fill="white" />
                <span className="font-helvetica text-[12px] font-semibold leading-4">
                  4.0
                </span>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Star width={17} height={17} fill="#F97300" />
                <span className="font-helvetica text-[12px] font-bold leading-4 text-orange">
                  New
                </span>
              </React.Fragment>
            )}
          </Badge>
        </div>
        <p className="font-helvetica text-[16px] font-thin text-davy">
          {subdistrict}
        </p>
      </div>
      {!!distance && (
        <span className="inline-block w-full text-right font-thin text-davy">
          {betterToKm(distance)}
        </span>
      )}
    </Link>
    // </motion.div>
  );
}

export default CardPlace;
