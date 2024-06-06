"use client";

import React, { SetStateAction , useState} from "react";
import { useQuery } from "@tanstack/react-query";
import PaginationComponent from "~/components/ready-use/pagination-button";

import Fancybox from "~/components/ready-use/fancybox";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { axiosInstance, imageFromBackend } from "~/lib/utils";
import { PlacePhoto } from "~/types";
import { useParams } from "next/navigation";



function Photo() {
  const params = useParams<{slug: string}>()
  const { data: detail } = useQuery({
    queryKey: ["place", params.slug],
    queryFn: async () => {
      return (await axiosInstance.get(`/place/find?slug=${params.slug}`)).data;
    },
    enabled: !!params.slug,
  });
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["place-photo", { place: detail.id, page }],
    queryFn: async () => {
      return axiosInstance
        .get(`/place-photo?place=${detail.id}&page=${page}`)
        .then((data) => data.data);
    },
    enabled: !!detail.id,
  });
  return (
    <>
      <Fancybox className="grid grid-cols-5 grid-rows-2 gap-3">
        {isLoading
          ? "Loading"
          : data && data.result
            ? data.result.map((photo: PlacePhoto) => (
                <a
                  data-fancybox="gallery"
                  className="block overflow-hidden"
                  href={imageFromBackend(photo.url)}
                  key={photo.id}
                >
                  <SkeletonImage
                    className="h-full rounded-lg object-cover"
                    src={imageFromBackend(photo.url)}
                    width={300}
                    height={300}
                    alt={photo.id}
                  />
                </a>
              ))
            : "Foto tidak ditemukan"}
      </Fancybox>

      <div className="mt-4">
        {data && data.pagination.pageCount > 1 && (
          <PaginationComponent
            data={data.pagination}
            page={page}
            setPage={setPage}
          />
        )}
      </div>
    </>
  );
}

export default Photo;
