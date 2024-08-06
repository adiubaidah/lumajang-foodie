import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Link from "next/link";

import { BadgeRate } from "~/components/ready-use/badge-rate";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { imageFromBackend } from "~/lib/utils";
import ArchiveButton from "../components/archive-button";
import Ulasan from "./ulasan";

async function Page({ params }: { params: { slug: string } }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 5 * 60,
      },
    },
  });
  const data = await queryClient.fetchQuery({
    queryKey: ["menu", params.slug],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/menu/find/?slug=${params.slug}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );
      const result = await response.json();
      return result;
    },
  });
  return (
    <div>
      <div className="flex flex-col items-center gap-x-3 py-3 md:flex-row">
        <div className="h-[300px] w-full shadow-md md:w-1/2">
          <SkeletonImage
            className="h-full w-full object-cover"
            height={600}
            width={600}
            alt={data.name}
            src={imageFromBackend(data.photo)}
          />
        </div>
        <div className="w-full space-y-2 md:w-1/2">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-normal">{data.name}</h1>
            <div className="flex items-center gap-x-2">
              <BadgeRate rate={data.rate._avg.star} />
              {data.rate._count.id > 0 && (
                <div className="flex flex-col">
                  <span className="text-davy">{data.rate._count.id}</span>
                  <span className="font-light text-davy">Ulasan</span>
                </div>
              )}
            </div>
          </div>
          <Link
            href={`/tempat-makan/${data.place.slug}`}
            className="group block w-full border-b-[1px] border-b-gray-300 py-3"
          >
            <div className="flex items-center gap-x-3">
              <div className="h-12 w-12">
                <SkeletonImage
                  src={imageFromBackend(data.place.photos[0].url)}
                  width={150}
                  height={150}
                  alt={data.name}
                  className=" rounded-lg object-cover"
                />
              </div>
              <div className="font-helvetica">
                <p className="text-[16px] group-hover:text-orange">
                  {data.place.name}
                </p>
                <span className="text-[14px] text-gray-400">
                  {data.place.address}
                </span>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-x-2">
            <ArchiveButton menu={data.id} />
          </div>
        </div>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Ulasan />
      </HydrationBoundary>
    </div>
  );
}

export default Page;
