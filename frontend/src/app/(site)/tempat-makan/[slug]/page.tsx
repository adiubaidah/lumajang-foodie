"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Copy, MapPin } from "lucide-react";

import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { EiCheck, IconsDistance } from "~/icons";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { axiosInstance, imageFromBackend } from "~/lib/utils";
import MapComponent from "~/components/ready-use/mapbox";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ButtonFollow } from "~/components/ready-use/button-follow";

export default function Overview() {
  const { slug } = useParams();
  const { data: detail } = useQuery({
    queryKey: ["place", slug],
    queryFn: async () => {
      return (await axiosInstance.get(`/place/find?slug=${slug}`)).data;
    },
    enabled: !!slug,
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
        {detail.description && (
          <React.Fragment>
            <h2 className="text-3xl font-normal">Tentang tempat makan ini</h2>
            <div
              dangerouslySetInnerHTML={{ __html: detail.description }}
              className="text-[14px] font-normal tracking-wider text-davy"
            />
          </React.Fragment>
        )}

        <div className="mt-7 flex flex-col md:flex-row">
          <div className="w-full md:w-3/5 space-y-3">
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
                      <p className="text-lg font-bold text-davy">
                        {detail.owner.name}
                      </p>
                      <p className="space-x-2 font-normal text-davy">
                        <span>{detail.owner._count.followers}</span>
                        <span>Follower</span>
                      </p>
                    </span>
                  </div>
                  <ButtonFollow  user={detail.owner.id}/>
                </div>
              </div>
            )}
            <ul>
              <h5 className="text-xl mb-1">Info lebih lanjut</h5>
              {detail.servesCoffee && (
                <li className="flex items-center text-lg font-light text-davy">
                  <EiCheck width={30} fill="#31af62" />
                  <span>Kopi</span>
                </li>
              )}
              {detail.takeout && (
                <li className="flex items-center text-lg font-light text-davy">
                  <EiCheck width={30} fill="#31af62" />
                  <span>Takeout</span>
                </li>
              )}
              {detail.liveMusic && (
                <li className="flex items-center text-lg font-light text-davy">
                  <EiCheck width={30} fill="#31af62" />
                  <span>Live Musik</span>
                </li>
              )}
              {detail.restRoom && (
                <li className="flex items-center text-lg font-light text-davy">
                  <EiCheck width={30} fill="#31af62" />
                  <span>Ruang Istirahat</span>
                </li>
              )}
              {detail.cashOnly && (
                <li className="flex items-center text-lg font-light text-davy">
                  <EiCheck width={30} fill="#31af62" />
                  <span>Hanya menerima Cash</span>
                </li>
              )}
            </ul>
          </div>
          <div className="w-full h-fit rounded-3xl p-7 shadow-[0px_4px_7.3px_0px_rgba(0,0,0,0.2)] md:w-2/5 ">
            <div>
              <h5 className="mb-2 text-xl font-black text-davy">Telepon</h5>
              <p>{detail.phoneNumber}</p>
            </div>
            <div>
              <h5 className="mb-2 text-xl font-black text-davy">Petunjuk</h5>
              <MapComponent
                latitude={viewport.latitude}
                longitude={viewport.longitude}
              />
              <p className="mt-4 text-[14px] font-light">{detail.address}</p>
            </div>
            <div className="mt-3 flex items-center gap-x-3">
              <Link className={cn(buttonVariants({variant: "outline"}), 'flex items-center gap-x-2')} href={"/#"} >
                <IconsDistance width={27} fill="#A65F5F" height={27}/>
                <span>Petunjuk</span>
              </Link>
              <Button variant={'outline'} className="flex items-center gap-x-2">
                <Copy size={27} color="#A65F5F"/>
                <span>Salin</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
