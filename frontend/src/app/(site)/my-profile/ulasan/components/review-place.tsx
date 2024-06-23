import { useQuery } from "@tanstack/react-query";

import moment from "moment";
import { BadgeRate } from "~/components/ready-use/badge-rate";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { Place, PlacePhoto, PlaceReview, User } from "~/types";
import { useAuth } from "~/hooks";
import { axiosInstance, imageFromBackend, humanizeIdTime } from "~/lib/utils";
import Loader from "~/components/ready-use/loader";

type Review = PlaceReview & { place: Place & { photos: PlacePhoto[] } } & {
  user: User;
} & { updatedAt: string };
function ReviewPlace() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["place-review", { user: user && user.id }],
    queryFn: async () => {
      return axiosInstance
        .get(`/place-review?user=${user.id}`)
        .then((data) => data.data);
    },
    staleTime: 1000 * 5 * 60,
    enabled: !!user && !!user.id,
  });
  return (
    <>
      {isLoading || !data ? (
        <Loader />
      ) : data && data.result.length > 0 ? (
        data.result.map((review: Review) => (
          <div key={review.id} className="w-full border-b-[1px] border-b-gray-300 py-3">
            <div className="flex items-center gap-x-3">
              <SkeletonImage
                src={imageFromBackend(review.place.photos[0].url)}
                width={150}
                height={150}
                alt={review.place.name}
                className="h-12 w-12 rounded-lg object-cover"
              />
              <div className="font-helvetica">
                <p className="text-[16px]">{review.place.name}</p>
                <span className="text-[14px] text-gray-400">
                  {review.place.address}
                </span>
              </div>
            </div>

            <div className="mt-3 flex w-fit items-center gap-x-2">
              <BadgeRate rate={review.star} />
              <p className="font-light text-gray-400">
                {moment(new Date(review.updatedAt)).format("mm MMMM yyyy")}
              </p>
            </div>

            <p className="text-[16px] font-helvetica text-gray-700 mt-3">{review.review}</p>
          </div>
        ))
      ) : (
        "Data tidak ada"
      )}
    </>
  );
}

export default ReviewPlace;
