"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { BottomNavbar } from "../components";
import SearchNotFound from "~/../public/assets/search-not-found.svg";
import PaginationComponent from "~/components/ready-use/pagination-link";

import { usePlacePreference, useUserLocation } from "~/hooks";
import { PlaceComplete, PlacePreference } from "~/types";
import { CardPlace } from "./components";
import { axiosInstance, cn, createQueryString, isOpen } from "~/lib/utils";
import { Filter } from "./components";

import { FilterData } from "./components/filter";
import { Button } from "~/components/ui/button";
import Loader from "~/components/ready-use/loader";
import SearchInput from "~/components/ready-use/search-input";

function Client() {
  const { location } = useUserLocation();
  const preferences = usePlacePreference();
  const searchParams = useSearchParams();
  const path = usePathname();
  const router = useRouter();
  const page = searchParams.get("page") || "1";
  const query = searchParams.get("q") || "";
  const subdistrict = searchParams.get("subdistrict") || "";
  const sort = searchParams.get("sort") || "name:asc";

  const [filter, setFilter] = useState<FilterData>({
    sort: "name:asc",
    other: {
      openNow: 0,
    },
  });

  useEffect(() => {
    let newFilter = { ...filter, sort }; // Start with current filter and update sort
    if (preferences)
      for (const [key, value] of searchParams.entries()) {
        if (value === "1") {
          if (key === "openNow") {
            newFilter.other.openNow = 1;
          } else {
            const preferenceExists = preferences.some(
              (preference) => preference.value === key,
            );
            if (preferenceExists) {
              newFilter.other[key] = 1;
            }
          }
        }
      }

    setFilter(newFilter); // Update the filter state once with the new filter object
  }, [searchParams, sort, preferences]);

  useEffect(() => {
    console.log(filter.other);
  }, [filter]);

  const { data, isLoading } = useQuery({
    queryKey: ["places", subdistrict, query, filter, page, location],
    queryFn: async () => {
      const queryString = createQueryString({
        longitude: location.longitude,
        latitude: location.latitude,
        sort: filter.sort,
        q: query,
        ...filter.other,
        subdistrict,
        page,
      });
      return (await axiosInstance.get(`/place?${queryString}`)).data;
    },
  });

  const handleRemoveFilter = (value: string) => {
    const query = new URLSearchParams(searchParams.toString());
    query.delete(value);
    //remove filter from filter state
    const newFilter = { ...filter };
    delete newFilter.other[value];
    setFilter(newFilter);
    router.replace(`${path}?${query}`);
  };

  return (
    <>
      <div className="shadow-sm md:hidden">
        <SearchInput />
      </div>
      <BottomNavbar />

      <div className="flex items-center gap-x-3">
        <Filter
          filter={filter}
          setFilter={setFilter}
          router={router}
          path={path}
          location={location}
        />
        {Object.entries(filter.other)
          .filter(([key, value]) => value === 1)
          .map(([key]) =>
            preferences?.find((preference) => preference.value === key),
          )
          .map(
            (active, index) =>
              active && (
                <Button
                  key={`${active}-${index}`}
                  className="flex items-center space-x-2"
                  onClick={() => handleRemoveFilter(active.value)}
                >
                  <span>{active.label}</span>
                  <X size={15} />
                </Button>
              ),
          )}
      </div>

      <div
        className={cn(
          "grid w-full gap-x-10 gap-y-11 py-3",
          !isLoading && data.result && data.result.length > 0
            ? "md:grid-cols-3"
            : "place-items-center",
        )}
      >
        {isLoading || !data ? (
          <div className="grid h-60 place-content-center">
            <Loader />
          </div>
        ) : data.result && data.result.length > 0 ? (
          data.result.map((place: PlaceComplete) => (
            <CardPlace
              key={place.id}
              slug={place.slug}
              srcImage={place.photoForThumbnail?.url}
              title={place.name}
              rate={place.averageStar}
              subdistrict={place.subdistrict}
              isOpen={isOpen(place.openingHours)}
              distance={place.distance}
            />
          ))
        ) : (
          <div className="flex flex-col items-center">
            <SearchNotFound height={100} width={100} />
            <p>Hasil tidak ditemukan</p>
          </div>
        )}
      </div>

      <div className="mt-4">
        {data && (
          <PaginationComponent
            data={data.pagination}
            path={path}
            query={searchParams.toString()}
          />
        )}
      </div>
    </>
  );
}

export default Client;
