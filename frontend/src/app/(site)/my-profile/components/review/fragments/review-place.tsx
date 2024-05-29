import { useQuery } from "@tanstack/react-query";

import { BadgeRate } from "~/components/ready-use/badge-rate";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { PlaceReview, User } from "~/types";
import { useAuth } from "~/hooks";
import { axiosInstance, imageFromBackend, humanizeIdTime } from "~/lib/utils";

type Review = PlaceReview & { user: User } & { updatedAt: string };
function ReviewPlace() {
  const auth = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["place-review", { user: auth.id }],
    queryFn: async () => {
      return axiosInstance
        .get(`/place-review?user=${auth.id}`)
        .then((data) => data.data);
    },
    staleTime: 1000 * 5 * 60,
    enabled: !!auth.id,
  });
  return (
    <>
      {isLoading
        ? "Loading"
        : data && data.result.length > 0
        ? data.result.map((review: Review) => (
            <div
              key={review.id}
              className="border-orange border-[1px] p-4 rounded-md shadow-[0px_4px_8px_0px_rgba(10,58,100,0.15)] w-full"
            >
              <div className="flex items-center justify-between">
                <span className="font-thin text-[14px]">
                  {humanizeIdTime(review.updatedAt)}
                </span>
                <BadgeRate rate={review.star} />
              </div>
              <p className="mt-3 font-light text-black">{review.review}</p>
            </div>
          ))
        : "Data tidak ada"}
    </>
  );
}

export default ReviewPlace;
