"use client"
import React, {useState} from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Pencil } from "lucide-react";

import { Button } from "~/components/ui/button";
import Edit from "./edit";
import { cn, imageFromBackend } from "~/lib/utils";
import { UserComplete } from "~/types";
import SkeletonImage from "~/components/ready-use/skeleton-image";


function Header({ dataUser }: { dataUser: UserComplete }) {
  const [openEdit, setOpenEdit] = useState(false);
  return (
      <>
        <div
          className={cn(
            "flex flex-col md:flex-row items-center md:justify-between bg-center bg-no-repeat px-4 text-white",
            "bg-gray-800 py-3",
            // `bg-[url('${imageFromBackend(
            //   dataUser.backgroundImage ?? "public/img/place/default.PNG"
            // )}')]`
          )}
        >
          <div className="flex flex-col md:flex-row items-center gap-y-2 gap-x-3">
            <SkeletonImage
              src={imageFromBackend(
                dataUser.image ?? "public/img/user/default.png",
              )}
              className="h-20 w-20 md:h-40 md:w-40 rounded-full border-2"
              alt={dataUser.name}
              width={200}
              height={200}
              skeletonStyle={{width: 40, height: 40}}
            />
            <div>
              <h3 className="font-medium">{dataUser.name}</h3>
              {!!dataUser.subdistrict && (
                <span className="mt-2 hidden md:flex items-center">
                  <MapPin />
                  <p>{dataUser.subdistrict.name}</p>
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-y-2">
            <Button
              className="md:order-first order-last md:ms-auto flex items-center gap-x-2"
              onClick={() => setOpenEdit(true)}
            >
              <Pencil size={14} />
              Edit Profil
            </Button>
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
        <Edit isOpen={openEdit} setIsOpen={setOpenEdit} value={dataUser} />
      </>
  );
}

export default Header;
