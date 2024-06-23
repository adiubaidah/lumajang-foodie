import React from 'react'
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Subdistrict, Place, PlacePhoto } from '~/types';
import SkeletonImage from '~/components/ready-use/skeleton-image';
import { useAuth } from "~/hooks";

import { axiosInstance, imageFromBackend } from "~/lib/utils";

type ArchivePlaceType = {
  id: string;
  placeId: string;
  userId: string;
  place: Place & {
    photos: PlacePhoto[];
    subdistrict: Subdistrict;
  };
};

function ArchiveMenu() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["menu-archive", { user: user && user.id }],
    queryFn: async () => {
      return (await axiosInstance.get(`/menu-archive`)).data;
    },
    enabled: user && !!user.id,
  });
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {isLoading
      ? "Loading"
      : data.result && data.result.length > 0
        ? data.result.map((archive: ArchivePlaceType) => (
            <React.Fragment key={archive.id}>
              <Link
                href={`/tempat-makan/${archive.place.slug}`}
                className="block rounded-2xl p-2.5 shadow-[0px_4px_7.3px_0px_rgba(0,0,0,0.2)] transition duration-200"
              >
                <div>
                  <div className="h-[200px]">
                    <SkeletonImage
                      src={imageFromBackend(archive.place.photos[0].url)}
                      alt={archive.place.name}
                      height={200}
                      width={200}
                      className="h-full w-full rounded-2xl object-cover"
                      skeletonStyle={{ borderRadius: 12 }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <h4 className="font-helvetica text-[17px] tracking-wider text-black">
                      {archive.place.name}
                    </h4>
                  </div>
                  <p className="font-helvetica text-[14px] font-thin tracking-wide text-davy">
                    {archive.place.subdistrict.name}
                  </p>
                </div>
              </Link>
            </React.Fragment>
          ))
        : "Data tidak ada"}
  </div>
  )
}

export default ArchiveMenu