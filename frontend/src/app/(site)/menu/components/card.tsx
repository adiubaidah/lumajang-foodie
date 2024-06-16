import React, { useRef } from "react";
import Link from "next/link";

import SkeletonImage from "~/components/ready-use/skeleton-image";
import { cn, imageFromBackend, rupiah } from "~/lib/utils";
import { BadgeRate } from "~/components/ready-use/badge-rate";

interface CardMenuProps {
  srcImage: string;
  title: string;
  slug: string;
  rate: number;
  price: number;
}

function CardMenu({ srcImage, title, rate, slug, price }: CardMenuProps) {
  return (
    <Link
      href={`/menu/${slug}`}
      className="block rounded-2xl p-2.5 shadow-[0px_4px_7.3px_0px_rgba(0,0,0,0.2)] transition duration-200"
    >
      <div>
        <div className="h-[248px]">
          <SkeletonImage
            src={imageFromBackend(srcImage)}
            alt={title}
            height={400}
            width={400}
            className="w-full h-full rounded-2xl object-cover"
            skeletonStyle={{ borderRadius: 12 }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between">
          <h4 className="font-helvetica text-[17px] tracking-wider text-black">
            {title}
          </h4>
          <BadgeRate rate={rate} />
        </div>
        <div>
          <p className="mt-1 font-helvetica text-[14px] text-black">
            {rupiah(price)}
          </p>
        </div>
      </div>
    </Link>
    // </motion.div>
  );
}

export default CardMenu;
