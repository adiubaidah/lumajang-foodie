import React, { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

import { Star } from "~/icons";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { betterToKm, cn, imageFromBackend, isOpen } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { rateColor } from "~/constant";
import { BadgeRate } from "~/components/ready-use/badge-rate";

interface CardPlaceProps {
  srcImage: string;
  title: string;
  slug: string;
  rate: number;
  subdistrict: string;
  isOpen: boolean;
  distance?: number;
}

function CardPlace({
  srcImage,
  title,
  rate,
  subdistrict,
  slug,
  isOpen,
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
    <a
      href={`/tempat-makan/${slug}`}
      className="block rounded-2xl p-2.5 shadow-[0px_4px_7.3px_0px_rgba(0,0,0,0.2)] transition duration-200"
    >
      <div>
        <div className="h-[248px]">
          <SkeletonImage
            src={imageFromBackend(srcImage)}
            alt={title}
            height={200}
            width={200}
            className="w-full h-full rounded-2xl object-cover"
            skeletonStyle={{ borderRadius: 12}}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <h4 className="font-helvetica text-[17px] tracking-wider text-black">
            {title}
          </h4>
          <BadgeRate rate={rate} />
        </div>
        <p className="font-helvetica text-[14px] font-thin tracking-wide text-davy">
          {subdistrict}
        </p>
      </div>
      <div className="flex items-center justify-between">
      {isOpen ? (
              <span className="text-islamic">Buka</span>
          ) : (
              <span className="text-puce">Tutup</span>
             
          )}

      {!!distance && (
        <span className="inline-block text-right font-thin text-davy">
          {betterToKm(distance)}
        </span>
      )}
      </div>
    </a>
    // </motion.div>
  );
}

export default CardPlace;
