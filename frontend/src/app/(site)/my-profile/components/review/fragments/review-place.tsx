import { useQuery } from "@tanstack/react-query";

import { BadgeRate } from "~/components/ready-use/badge-rate";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { PlaceReview, User } from "~/types";
import { useAuth } from "~/hooks";
import { axiosInstance, imageFromBackend, humanizeIdTime } from "~/lib/utils";

type Review = PlaceReview & { user: User } & { updatedAt: string };
function ReviewPlace() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["place-review", { user: user.id }],
    queryFn: async () => {
      return axiosInstance
        .get(`/place-review?user=${user.id}`)
        .then((data) => data.data);
    },
    staleTime: 1000 * 5 * 60,
    enabled: !!user.id,
  });
  return (
    <>
      {isLoading
        ? "Loading"
        : data && data.result.length > 0
          ? data.result.map((review: Review) => (
              <div
                key={review.id}
                className="w-full rounded-md border-[1px] border-orange p-4 shadow-[0px_4px_8px_0px_rgba(10,58,100,0.15)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-thin">
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
