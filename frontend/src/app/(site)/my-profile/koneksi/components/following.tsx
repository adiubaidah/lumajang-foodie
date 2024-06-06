import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dot } from "lucide-react";
import toast from "react-hot-toast";
import { UserDoubleCheck } from "~/icons";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { useAuth } from "~/hooks";
import { UserComplete } from "~/types";
import { axiosInstance, imageFromBackend } from "~/lib/utils";
import { Button } from "~/components/ui/button";

type FollowerType = {
  id: string;
  followerId: string;
  followingId: string;
  following: UserComplete;
};

function Following() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["following", { user: user && user.id }],
    queryFn: async () => {
      return (await axiosInstance.get(`/user-follow/following/${user.id}`))
        .data;
    },
    enabled: user && !!user.id,
  });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {isLoading
        ? "Loading"
        : data && data.length > 0
          ? data.map((following: FollowerType) => (
              <div key={following.id} className="flex items-center gap-x-3">
                <SkeletonImage
                  src={imageFromBackend(
                    following.following.image ?? "public/img/user/default.png",
                  )}
                  alt={following.following.name}
                  width={100}
                  height={100}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">{following.following.name}</p>
                  <div className="flex items-center">
                    <small className="space-x-1.5">
                      <span>
                        {following.following._count.placeReviews +
                          following.following._count.menuReviews}
                      </span>
                      <span>Ulasan</span>
                    </small>
                    <Dot />
                    <small className="space-x-1.5">
                      <span>{following.following._count.followers}</span>
                      <span>Pengikut</span>
                    </small>
                  </div>
                </div>
                <UnfollowButton user={following.following.id} />
              </div>
            ))
          : "Data tidak ada"}
    </div>
  );
}

export default Following;

function UnfollowButton({ user }: { user: string }) {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const unfollowMutation = useMutation({
    mutationFn: async () => {
      return (await axiosInstance.delete(`/user-follow/${user}`)).data;
    },
    onSuccess: () => {
      toast.success("Berhasil unfollow");
      queryClient.invalidateQueries({
        queryKey: ["following", { user: currentUser && currentUser.id }],
      });
    },
  });
  return (
    <Button
      className="flex items-center gap-x-2"
      variant={"ghost"}
      onClick={() => unfollowMutation.mutate()}
    >
      <UserDoubleCheck width={26} height={26} />
    </Button>
  );
}
