"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Pencil } from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn, imageFromBackend } from "~/lib/utils";
import { UserComplete } from "~/types";
import SkeletonImage from "~/components/ready-use/skeleton-image";

function Header({ dataUser }: { dataUser: UserComplete }) {
  return (
    <>
      <div
        className={cn(
          "relative flex flex-col items-center bg-center bg-no-repeat px-4 py-5 text-white md:flex-row md:justify-between",
          "bg-cover bg-center",
        )}
        style={{
          backgroundImage: `url('${
            dataUser.backgroundImage
              ? imageFromBackend(dataUser.backgroundImage)
              : "/assets/default-bg1.jpg"
          }')`,
        }}
      >
        <div
          className="absolute left-0 top-0 z-0 h-full w-full bg-black opacity-50"
          style={{ filter: "brightness(50%)" }}
        />
        <div className="z-10 flex flex-col items-center gap-x-3 gap-y-2 md:flex-row">
          <div className="h-20 w-20 md:h-40 md:w-40">
            <SkeletonImage
              src={
                dataUser.image
                  ? imageFromBackend(dataUser.image)
                  : "/assets/avatar.png"
              }
              className="rounded-full border-2"
              alt={dataUser.name}
              width={200}
              height={200}
              skeletonStyle={{
                width: "100%",
                height: "100%",
                borderRadius: "100%",
              }}
            />
          </div>
          <div>
            <h3 className="font-medium">{dataUser.name}</h3>
            {!!dataUser.subdistrict && (
              <span className="mt-2 hidden items-center md:flex">
                <MapPin />
                <p>{dataUser.subdistrict.name}</p>
              </span>
            )}
          </div>
        </div>
        <div className="z-10 flex flex-col items-center gap-y-2">
          <div className="mt-4 flex gap-x-3">
            <div className="text-center">
              <span className="text-2xl font-medium">
                {dataUser._count.placeReviews + dataUser._count.menuReviews}
              </span>
              <p className="text-[16px] font-light">Ulasan</p>
            </div>
            <div className="border-r-2" />
            <div className="text-center">
              <span className="text-2xl font-medium">
                {dataUser._count.followers}
              </span>
              <p className="text-[16px] font-light">Pengikut</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
