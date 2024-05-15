import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/utils";
import { PlacePhoto } from "~/types";

function usePlacePhoto({ place }: { place: string }) {
  const { data = [] } = useQuery<PlacePhoto[]>({
    queryKey: ["place-photo", { place }],
    queryFn: async () => {
      return axiosInstance
        .get(`/place-photo?place=${place}`)
        .then((data) => data.data);
    },
    enabled: !!place,
    staleTime: 1000 * 5 * 60,
  });

  return data;
}

export default usePlacePhoto;
