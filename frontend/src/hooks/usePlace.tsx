import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/utils";

type PlaceParamsById = {
  id: string;
  slug?: never;
  name?: never;
  location?: never;
};
type PlaceParamsBySlug = {
  id?: never;
  slug: string;
  name?: never;
  location?: never;
};
type PlaceParamsByNameAndLocation = {
  id?: never;
  slug?: never;
  name: string;
  location: string;
};
type PlaceParamsByNameOnly = {
  id?: never;
  slug?: never;
  name: string;
  location?: never;
};

type PlaceParams<T> =
  | PlaceParamsById
  | PlaceParamsBySlug
  | PlaceParamsByNameAndLocation
  | PlaceParamsByNameOnly;

function usePlace<T>({ id, slug, name, location }: PlaceParams<T>) {
  const queryKey = id
    ? ["place", id]
    : slug
    ? ["place", slug]
    : name
    ? ["place", name, location]
    : ["place"];

  const { data } = useQuery<T>({
    queryKey,
    queryFn: async () => {
      return axiosInstance.get("/place");
    },
  });

  return data;
}

export default usePlace;
