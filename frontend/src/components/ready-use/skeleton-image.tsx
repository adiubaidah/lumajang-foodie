"use client"
import { CSSProperties, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { type ClassValue } from "clsx";
import Image from "next/image";
import "react-loading-skeleton/dist/skeleton.css";

import { cn, imageFromBackend } from "~/lib/utils";

interface Props {
  src: string;
  alt: string;
  className?: ClassValue;
  skeletonStyle?: CSSProperties;
  height: number;
  width: number;
}

function SkeletonImage({
  src,
  className,
  alt,
  height,
  width,
  skeletonStyle,
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <Skeleton
          style={{
            width: "100%",
            height: "100%",
            zIndex: -10,
            ...skeletonStyle,
          }}
          containerClassName="w-full h-full"
        />
      )}
      <Image
        src={src}
        alt={alt}
        className={className?.toString()}
        style={{ visibility: !loaded ? "hidden" : "visible" }}
        onLoad={() => setLoaded(true)}
        height={height}
        width={width}
      />
    </>
  );
}

export default SkeletonImage;
