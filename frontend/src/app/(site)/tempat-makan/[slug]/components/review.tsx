import { SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/utils";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { PlaceReview, User } from "~/types";

export type ReviewProps = {
  placeId: string;
  page: number;
  setPage: React.Dispatch<SetStateAction<number>>;
};

type Review = PlaceReview & { user: User };

function Review({ placeId, page, setPage }: ReviewProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["review", { place: placeId }, page],
    queryFn: async () => {
      return axiosInstance
        .get(`/review?place=${placeId}`)
        .then((data) => data.data);
    },
    enabled: !!placeId,
    staleTime: 1000 * 5 * 60,
  });
  return (
    <div>
      {isLoading
        ? "Loading"
        : data && data.result
        ? data.result.map((review: Review) => (
            <div key={review.id}>
              <SkeletonImage
                src={review.user.image as string}
                height={40}
                width={40}
                alt={review.user.id}
              />
            </div>
          ))
        : "Data tidak ditemukan"}
    </div>
  );
}

export default Review;
