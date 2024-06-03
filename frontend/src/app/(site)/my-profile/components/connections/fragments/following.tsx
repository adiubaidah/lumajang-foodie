import { useAuth } from "~/hooks";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/utils";

function Following() {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["following", { user: user && user.id }],
    queryFn: async () => {
      return (await axiosInstance.get(`/user-follow/following/${user.id}`))
        .data;
    },
    enabled: user && !!user.id,
  });
  return JSON.stringify(data);
}

export default Following;
