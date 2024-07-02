"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import SearchNotFound from "~/../public/assets/search-not-found.svg";
import PaginationComponent from "~/components/ready-use/pagination-link";

import { useUserLocation } from "~/hooks";
import { PlaceComplete } from "~/types";
import { CardPlace } from "./components";
import { axiosInstance, cn, createQueryString, isOpen } from "~/lib/utils";
import { Filter } from "./components";

import { FilterData, filterOther } from "./components/filter";
import { Button } from "~/components/ui/button";
import Loader from "~/components/ready-use/loader";

function Client() {
  const { location } = useUserLocation();
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
      cashOnly: 0,
      delivery: 0,
      liveMusic: 0,
      openNow: 0,
      restRoom: 0,
      servesCoffee: 0,
      takeout: 0,
    },
  });

  useEffect(() => {
    const cashOnly = parseInt(searchParams.get("cashOnly") || "0", 10);
    const delivery = parseInt(searchParams.get("delivery") || "0", 10);
    const liveMusic = parseInt(searchParams.get("liveMusic") || "0", 10);
    const openNow = parseInt(searchParams.get("openNow") || "0", 10);
    const restRoom = parseInt(searchParams.get("restRoom") || "0", 10);
    const servesCoffee = parseInt(searchParams.get("servesCoffee") || "0", 10);
    const takeout = parseInt(searchParams.get("takeout") || "0", 10);

    setFilter({
      sort,
      other: {
        cashOnly,
        delivery,
        liveMusic,
        openNow,
        restRoom,
        servesCoffee,
        takeout,
      },
    });
  }, [searchParams, sort, query]);

  const { data, isLoading } = useQuery({
    queryKey: ["places", subdistrict, query, filter, page, location],
    queryFn: async () => {
      const queryString = createQueryString({
        longitude: location.longitude,
        latitude: location.latitude,
        sort: filter.sort,
        q: query,
        subdistrict,
        ...filter.other,
        page,
      });
      return (await axiosInstance.get(`/place?${queryString}`)).data;
    },
  });

  const handleRemoveFilter = (id: string) => {
    const query = new URLSearchParams(searchParams.toString());
    query.delete(id);
    router.replace(`${path}?${query}`);
  };

  return (
    <>
      <div className="flex items-center gap-x-3">
        <Filter
          filter={filter}
          router={router}
          path={path}
          location={location}
        />
        {Object.entries(filter.other)
          .filter(([key, value]) => value === 1)
          .map(([key]) => key)
          .map((active, index) => (
            <Button
              key={`${active}-${index}`}
              className="flex items-center space-x-2"
              onClick={() => handleRemoveFilter(active)}
            >
              <span>
                {filterOther.find((flto) => flto.id === active)?.label}
              </span>
              <X size={15} />
            </Button>
          ))}
      </div>

      <div
        className={cn(
          "grid w-full gap-x-10 gap-y-11 py-3",
          !isLoading && data.result.length > 0
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
              srcImage={
                place.photoForThumbnail
                  ? place.photoForThumbnail.url
                  : "public/img/place/default.PNG"
              }
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
