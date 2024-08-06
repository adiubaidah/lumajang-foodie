import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { imageFromBackend } from "~/lib/utils";

import SkeletonImage from "~/components/ready-use/skeleton-image";
import { axiosInstance } from "~/lib/utils";
import { useAuth } from "~/hooks";
import { Place, PlacePhoto, Subdistrict } from "~/types";

type ArchivePlaceType = {
  id: string;
  placeId: string;
  userId: string;
  place: Place & {
    photos: PlacePhoto[];
    subdistrict: Subdistrict;
  };
};

function ArchivePlace() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["place-archive", { user: user && user.id }],
    queryFn: async () => {
      return (await axiosInstance.get(`/place-archive?user=${user.id}`)).data;
    },
    enabled: user && !!user.id,
  });
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
  );
}

export default ArchivePlace;
