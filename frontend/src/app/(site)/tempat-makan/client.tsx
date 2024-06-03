"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import PaginationComponent from "~/components/ready-use/pagination-link";

import { useUserLocation } from "~/hooks";
import { Place, PlacePhoto } from "~/types";
import { CardPlace } from "./components";
import { axiosInstance, createQueryString } from "~/lib/utils";
import { Filter } from "./components";

import { FilterData, filterOther } from "./components/filter";
import { Button } from "~/components/ui/button";
// import { Slider } from "~/components/ui/slider";

type PlaceComplete = Place & {
  photoForThumbnail?: PlacePhoto;
  averageStar: number;
  subdistrict: string;
  distance?: number;
};

function Client() {
  const { location } = useUserLocation();
  const searchParams = useSearchParams();
  const path = usePathname();
  const router = useRouter();
  const page = searchParams.get("page") || "1";
  const query = searchParams.get("q") || "";
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
    const sort = searchParams.get("sort") || "name:asc";
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
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ["places", filter, page, location],
    queryFn: async () => {
      const queryString = createQueryString({
        longitude: location.longitude,
        latitude: location.latitude,
        sort: filter.sort,
        ...filter.other,
        page,
      });
      return axiosInstance
        .get(`/place?${queryString}`)
        .then((data) => data.data);
    },
    staleTime: 1000 * 5 * 60,
  });

  const handleRemoveFilter = (id: string) => {
    const query = new URLSearchParams(searchParams.toString());
    query.delete(id);
    router.replace(`${path}?${query}`);
  };

  return (
    <main className="container max-w-full">
      <h1>Daftar Tempat Makan</h1>
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

      <div className="grid gap-x-10 gap-y-11 py-3 md:grid-cols-3">
        {isLoading
          ? "Loading"
          : data.result.length > 0
            ? data.result.map((place: PlaceComplete) => (
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
                  distance={place.distance}
                />
              ))
            : "Data tidak ditemukan"}
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
    </main>
  );
}

export default Client;
