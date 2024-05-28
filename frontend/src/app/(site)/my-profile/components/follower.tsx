import { useAuth } from "~/hooks";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/utils";

function Follower() {
  const user = useAuth();
  const { data } = useQuery({
    queryKey: ["follower", { user: user && user.id }],
    queryFn: async () => {
      return (await axiosInstance.get(`/user-follow/follower/${user.id}`)).data;
    },
    enabled: user && !!user.id,
  });
  return JSON.stringify(data);
}

export default Follower;
