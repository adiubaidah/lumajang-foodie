"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import { CircleChevronRight, Copy, MapPin } from "lucide-react";

import { BadgeRate } from "~/components/ready-use/badge-rate";
import Loader from "~/components/ready-use/loader";
import { Separator } from "~/components/ui/separator";
import { buttonVariants } from "~/components/ui/button";
import { EiCheck, IconsDistance } from "~/icons";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import {
  axiosInstance,
  createQueryString,
  imageFromBackend,
  cn,
  humanizeIdTime,
} from "~/lib/utils";
import MapComponent from "~/components/ready-use/mapbox";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ButtonFollow } from "~/components/ready-use/button-follow";
import { OpeningHours, PlacePhoto } from "~/types";
import { useAuth } from "~/hooks";
import toast from "react-hot-toast";

export default function Overview() {
  const { slug } = useParams();
  const path = usePathname();
  const { user } = useAuth();
  const { data: detail } = useQuery({
    queryKey: ["place", slug],
    queryFn: async () => {
      return (await axiosInstance.get(`/place/find?slug=${slug}`)).data;
    },
    enabled: !!slug,
  });

  const { data: ulasan, isLoading } = useQuery({
    queryKey: [
      "place-review",
      { place: detail.id, perPage: 3, page: 1, auth: null },
    ],
    queryFn: async () => {
      const query = createQueryString({
        place: detail.id,
        perPage: 3,
      });
      return (await axiosInstance.get(`/place-review?${query}`)).data;
    },
    enabled: !!detail.id,
  });

  const { data: menu } = useQuery({
    queryKey: ["place-photo", { place: detail.id, perPage: 2 }],
    queryFn: async () => {
      const query = createQueryString({
        place: detail.id,
        perPage: 1,
        type: "menu",
      });
      return (await axiosInstance.get(`/place-photo?${query}`)).data.result[0];
    },
    enabled: !!detail.id,
  });

  const [viewport, setViewport] = useState({
    latitude: -8.133132,
    longitude: 113.22244,
    zoom: 16, // Atur zoom sesuai keinginan
  });

  useEffect(() => {
    setViewport({
      ...viewport,
      latitude: detail.location.coordinates[1],
      longitude: detail.location.coordinates[0],
    });
  }, [detail.location]);

  return (
    !!detail && (
      <div>
        <h2 className="text-3xl font-normal">Tentang tempat makan ini</h2>
        {detail.description && (
          <React.Fragment>
            <div
              dangerouslySetInnerHTML={{ __html: detail.description }}
              className="text-[14px] font-normal tracking-wider text-davy"
            />
          </React.Fragment>
        )}

        <div className="mt-7 flex flex-col md:flex-row">
          <div className="w-full space-y-3 pr-6 md:w-3/5">
            {detail.owner && (
              <div className="mt-3">
                <h2 className="text-xl font-normal">Pemilik restoran</h2>
                <div className="flex w-full items-center justify-between md:w-3/4">
                  <div className="mt-4 flex items-center gap-x-2">
                    <SkeletonImage
                      src={imageFromBackend(detail.owner.image)}
                      width={100}
                      height={100}
                      alt={detail.owner.name}
                      className="h-[120px] w-[120px] rounded-full border-2 border-soft-red outline-2 outline-soft-red"
                    />
                    <span>
                      <Link
                        href={`/user-detail/${detail.owner.id}`}
                        className="text-lg font-bold text-davy"
                      >
                        {detail.owner.name}
                      </Link>
                      <p className="space-x-2 font-normal text-davy">
                        <span>{detail.owner._count.followers}</span>
                        <span>Follower</span>
                      </p>
                    </span>
                  </div>
                  <ButtonFollow user={detail.owner.id} />
                </div>
              </div>
            )}
            {menu && (
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <h5 className="text-xl">Menu</h5>
                  <Link
                    href={`${path}/menu`}
                    className="flex items-center gap-x-2 text-[16px] text-puce hover:text-orange"
                  >
                    <span>Lihat semua menu</span>
                    <CircleChevronRight size={16} />
                  </Link>
                </div>

                <div className="stackone">
                  <SkeletonImage
                    src={imageFromBackend(menu.url)}
                    width={200}
                    height={200}
                    alt={"menu"}
                    className="h-full rounded-md object-cover"
                  />
                </div>
              </div>
            )}

            <ul>
              <h5 className="mb-1 text-xl">Info lebih lanjut</h5>
              {detail.preferences.length > 0 &&
                detail.preferences.map((preference: any, index: string) => (
                  <li
                    className="flex items-center text-lg font-light text-davy"
                    key={index}
                  >
                    <EiCheck width={30} fill="#31af62" />
                    <span>{preference.placePreferences.label}</span>
                  </li>
                ))}
            </ul>
            <h5 className="text-[20px]">Jam Operasional</h5>
            <table>
              <tbody>
                {detail.openingHours.map((hour: OpeningHours) => (
                  <tr key={hour.day} className="flex items-center gap-x-2">
                    <td width={70}> {hour.day} </td>
                    {!hour.openTime && !hour.closeTime ? (
                      <span className="text-red-500">Tutup</span>
                    ) : (
                      <React.Fragment>
                        <td> {hour.openTime} </td>
                        <td>-</td>
                        <td> {hour.closeTime} </td>
                      </React.Fragment>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              {isLoading ? (
                <div>
                  <Loader />
                </div>
              ) : (
                ulasan &&
                ulasan.result && (
                  <React.Fragment>
                    <div className="flex flex-col gap-y-7">
                      {ulasan.result.map((review: any) => (
                        <div
                          key={review.id}
                          className="rounded-md border-[1px] border-orange p-4 shadow-[0px_4px_8px_0px_rgba(10,58,100,0.15)]"
                        >
                          <div className="flex items-center gap-x-3">
                            <SkeletonImage
                              src={imageFromBackend(
                                review.user.image ??
                                  "public/img/user/default.png",
                              )}
                              height={40}
                              width={40}
                              className="rounded-full"
                              alt={review.user.id}
                            />
                            <span className="text-lg font-medium">
                              {review.user.name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[14px] font-thin">
                              {humanizeIdTime(review.updatedAt)}
                            </span>
                            <BadgeRate rate={review.star} />
                          </div>
                          <p className="mt-3 font-light text-black">
                            {review.review}
                          </p>
                          <Separator className="mt-3" />
                          <div className="flex">
                            <ButtonFollow user={review.user.id} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={`${path}/ulasan`}
                      className="mt-3 flex items-center gap-x-2 text-[16px] text-puce hover:text-orange"
                    >
                      <span>Lihat semua ulasan</span>
                      <CircleChevronRight size={16} />
                    </Link>
                  </React.Fragment>
                )
              )}
            </div>
          </div>

          <div className="sticky -top-0 h-fit w-full rounded-3xl p-7 shadow-[0px_4px_7.3px_0px_rgba(0,0,0,0.2)] md:w-2/5">
            <div>
              <h5 className="mb-2 text-xl font-black text-davy">Telepon</h5>
              <p>{detail.phoneNumber}</p>
            </div>
            <div>
              <h5 className="mb-2 text-xl font-black text-davy">Lokasi</h5>
              <MapComponent
                latitude={viewport.latitude}
                longitude={viewport.longitude}
              />
              <p className="mt-4 text-[14px] font-light">{detail.address}</p>
            </div>
            <div className="mt-3 flex items-center gap-x-3">
              <Link
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "flex items-center gap-x-2",
                )}
                href={`https://www.google.com/maps/dir/?api=1&destination=${detail.location.coordinates[1]},${detail.location.coordinates[0]}`}
                target="_blank"
              >
                <IconsDistance width={27} fill="#A65F5F" height={27} />
                <span>Petunjuk</span>
              </Link>
              <Button
                variant={"outline"}
                className="flex items-center gap-x-2"
                onClick={() => {
                  navigator.clipboard.writeText(detail.address);
                  toast.success("Alamat berhasil disalin")
                }}
              >
                <Copy size={27} color="#A65F5F" />
                <span>Salin</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
