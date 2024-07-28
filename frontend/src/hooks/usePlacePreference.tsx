import React from "react";
import { useQuery } from "@tanstack/react-query";
import { PlacePreference } from "~/types";
import { axiosInstance } from "~/lib/utils";

function usePlacePreference() {
  const { data } = useQuery<PlacePreference[]>({
    queryKey: ["place-preference"],
    queryFn: async () => {
      return (await axiosInstance.get("/place-preference")).data;
    },
    staleTime: Infinity,
  });
  return data;
}

export default usePlacePreference;
