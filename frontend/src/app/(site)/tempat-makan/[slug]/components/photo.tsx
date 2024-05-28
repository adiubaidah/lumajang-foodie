import { useQuery } from "@tanstack/react-query";
import React, { SetStateAction } from "react";
import PaginationComponent from "~/components/ready-use/pagination-button";

import Fancybox from "~/components/ready-use/fancybox";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { axiosInstance, imageFromBackend } from "~/lib/utils";
import { PlacePhoto } from "~/types";

export type PhotoProps = {
  placeId: string;
  page: number;
  setPage: React.Dispatch<SetStateAction<number>>;
};

function Photo({ placeId, page, setPage }: PhotoProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["place-photo", { place: placeId, page }],
    queryFn: async () => {
      return axiosInstance
        .get(`/place-photo?place=${placeId}&page=${page}`)
        .then((data) => data.data);
    },
    enabled: !!placeId,
    staleTime: 1000 * 5 * 60,
  });
  return (
    <div>
      {isLoading ? (
        "Loading"
      ) : data && data.result ? (
        <Fancybox className="grid grid-cols-5 gap-3 grid-rows-2 h-[500px]">
          {data.result.map((photo: PlacePhoto) => (
            <a
              data-fancybox="gallery"
              className="block overflow-hidden"
              href={imageFromBackend(photo.url)}
              key={photo.id}
            >
              <SkeletonImage
                className="h-full object-cover rounded-lg"
                src={imageFromBackend(photo.url)}
                width={300}
                height={300}
                alt={photo.id}
              />
            </a>
          ))}
        </Fancybox>
      ) : (
        "Foto tidak ditemukan"
      )}
      <div className="mt-4">
        {data && data.pagination.pageCount > 1 && (
          <PaginationComponent
            data={data.pagination}
            page={page}
            setPage={setPage}
          />
        )}
      </div>
    </div>
  );
}

export default Photo;
