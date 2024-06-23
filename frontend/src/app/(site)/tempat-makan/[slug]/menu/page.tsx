"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Fancybox from "~/components/ready-use/fancybox";
import Loader from "~/components/ready-use/loader";
import PaginationComponent from "~/components/ready-use/pagination-button";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import CardMenu from "~/app/(site)/menu/components/card";
import { MenuWithPhoto, PlacePhoto } from "~/types";
import {
  axiosInstance,
  createQueryString,
  imageFromBackend,
  cn,
} from "~/lib/utils";

function Menu() {
  const params = useParams<{ slug: string }>();
  const { data: detail } = useQuery({
    queryKey: ["place", params.slug],
    queryFn: async () => {
      return (await axiosInstance.get(`/place/find?slug=${params.slug}`)).data;
    },
    enabled: !!params.slug,
  });

  const [menuPhotoPage, setMenuPhotoPage] = useState(1);
  const [menuPage, setMenuPage] = useState(1);

  const { data: menuPhoto, isLoading: menuPhotoLoading } = useQuery({
    queryKey: [
      "place-photo",
      { place: detail.id, page: menuPhotoPage, perPage: 10, type: "menu" },
    ],
    queryFn: async () => {
      const query = createQueryString({
        place: detail.id,
        page: menuPhotoPage,
        perPage: 10,
        type: "menu",
      });
      return (await axiosInstance.get(`/place-photo?${query}`)).data;
    },
    enabled: !!detail.id,
  });

  const { data: menu, isLoading: menuLoading } = useQuery({
    queryKey: ["menu", { place: detail.id, page: menuPage, perPage: 10 }],
    queryFn: async () => {
      const query = createQueryString({
        place: detail.id,
        page: menuPage,
        perPage: 10,
      });
      return (await axiosInstance.get(`/menu?${query}`)).data;
    },
    enabled: !!detail.id,
  });

  return (
    <div>
      {menuPhotoLoading ? (
        <Loader />
      ) : (
        menuPhoto &&
        menuPhoto.result &&
        menuPhoto.result.length > 0 && (
          <React.Fragment>
            <h5 className="mb-1 text-xl">List Menu</h5>
            <Fancybox
              className={cn(
                "grid grid-cols-5 gap-3",
                menuPhotoLoading &&
                  "grid-cols-1 grid-rows-1 place-items-center",
              )}
            >
              {menuPhoto.result.map((photo: PlacePhoto) => (
                <a
                  data-fancybox="gallery"
                  className="block overflow-hidden"
                  href={imageFromBackend(photo.url)}
                  key={photo.id}
                >
                  <SkeletonImage
                    className="h-full rounded-lg object-cover"
                    src={imageFromBackend(photo.url)}
                    width={300}
                    height={300}
                    alt={photo.id}
                  />
                </a>
              ))}
            </Fancybox>

            <div className="mt-4">
              {menuPhoto.pagination.pageCount > 1 && (
                <PaginationComponent
                  data={menuPhoto.pagination}
                  page={menuPhotoPage}
                  setPage={setMenuPhotoPage}
                />
              )}
            </div>
          </React.Fragment>
        )
      )}

      {menuLoading ? (
        <Loader />
      ) : (
        menu &&
        menu.result &&
        menu.result.length > 0 && (
          <React.Fragment>
            <h5 className="mb-1 mt-6 text-xl">Menu</h5>
            <div
              className={cn(
                "grid grid-cols-3 gap-10",
                menuLoading && "grid-cols-1 grid-rows-1 place-items-center",
              )}
            >
              {menu.result.map((menu: MenuWithPhoto) => (
                <CardMenu
                  key={menu.id}
                  title={menu.name}
                  price={menu.price}
                  rate={menu.averageStar}
                  slug={menu.slug}
                  srcImage={menu.photo}
                />
              ))}
            </div>

            <div className="mt-4">
              {menu.pagination.pageCount > 1 && (
                <PaginationComponent
                  data={menu.pagination}
                  page={menuPage}
                  setPage={setMenuPage}
                />
              )}
            </div>
          </React.Fragment>
        )
      )}
    </div>
  );
}

export default Menu;
