import { useAuth } from "~/hooks";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance, imageFromBackend } from "~/lib/utils";
import { User, UserComplete } from "~/types";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { Dot } from "lucide-react";
import { useParams } from "next/navigation";

type FollowerType = {
  id: string;
  followerId: string;
  followingId: string;
  follower: UserComplete;
};

function Follower() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ["follower", { user: params.id }],
    queryFn: async () => {
      return (await axiosInstance.get(`/user-follow/follower/${params.id}`)).data;
    },
    enabled: !!params.id,
  });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {isLoading
        ? "Loading"
        : data && data.length > 0
          ? data.map((follower: FollowerType) => (
              <div key={follower.id} className="flex items-center gap-x-3">
                <SkeletonImage
                  src={imageFromBackend(
                    follower.follower.image ?? "public/img/user/default.png",
                  )}
                  alt={follower.follower.name}
                  width={100}
                  height={100}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">{follower.follower.name}</p>
                  <div className="flex items-center">
                    <small className="space-x-1.5">
                      <span>
                        {follower.follower._count.placeReviews +
                          follower.follower._count.menuReviews}
                      </span>
                      <span>Ulasan</span>
                    </small>
                    <Dot />
                    <small className="space-x-1.5">
                      <span>{follower.follower._count.followers}</span>
                      <span>Pengikut</span>
                    </small>
                  </div>
                </div>
              </div>
            ))
          : "Data tidak ada"}
    </div>
  );
}

export default Follower;
