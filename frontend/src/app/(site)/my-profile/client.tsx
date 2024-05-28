"use client";
import { useState } from "react";
import { MapPin, Pencil } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { cn, imageFromBackend } from "~/lib/utils";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { useAuth } from "~/hooks";
import { axiosInstance } from "~/lib/utils";
import { Subdistrict, User } from "~/types";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Edit from "./components/edit";
import { Review } from "./components";
import Follower from "./components/follower";

type UserSubdistrict = User & { subdistrict: Subdistrict };

function Client() {
  const [openEdit, setOpenEdit] = useState(false);
  const user = useAuth();
  const { data: dataUser } = useQuery<UserSubdistrict>({
    queryKey: ["user", user && user.id],
    queryFn: async () => {
      return axiosInstance.get(`/user/${user.id}`).then((data) => data.data);
    },
    enabled: !!user && !!user.id,
    staleTime: Infinity,
  });
  return (
    dataUser && (
      <>
        <div className="container max-w-full">
          <div
            className={cn(
              "relative flex items-center justify-between bg-no-repeat h-[220px] bg-center text-white px-4",
              "bg-gray-800"
              // `bg-[url('${imageFromBackend(
              //   dataUser.backgroundImage ?? "public/img/place/default.PNG"
              // )}')]`
            )}
          >
            <div className="flex items-center gap-x-3">
              <SkeletonImage
                src={imageFromBackend(
                  dataUser.image ?? "public/img/user/default.png"
                )}
                className="rounded-full border-2 w-40 h-40"
                alt={dataUser.name}
                width={400}
                height={400}
              />
              <div>
                <h3 className="font-medium">{dataUser.name}</h3>
                {!!dataUser.subdistrict && (
                  <span className="flex items-center mt-2">
                    <MapPin />
                    <p>{dataUser.subdistrict.name}</p>
                  </span>
                )}
              </div>
            </div>
            <div>
              <Button
                className="ms-auto flex items-center gap-x-2"
                onClick={() => setOpenEdit(true)}
              >
                <Pencil size={14} />
                Edit Profil
              </Button>
              <div className="flex gap-x-3 mt-4">
                <div className=" text-center">
                  <span className="font-medium text-2xl">0</span>
                  <p className="text-[16px]">Ulasan</p>
                </div>
                <div className="border-r-2" />
                <div className="text-center">
                  <span className="font-medium text-2xl">0</span>
                  <p className="text-[16px]">Pengikut</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Tabs defaultValue="review" className="flex items-center">
              <TabsList className="mt-20 p-0 flex flex-col gap-y-4 bg-transparent w-1/3">
                <TabsTrigger
                  className={cn(
                    "w-full text-start inline-block",
                    "data-[state=active]:text-puce data-[state=active]:border-l-4 data-[state=active]:border-puce"
                  )}
                  value="review"
                >
                  Ulasan
                </TabsTrigger>
                <TabsTrigger
                  className={cn(
                    "w-full text-start inline-block",
                    "data-[state=active]:text-puce data-[state=active]:border-l-4 data-[state=active]:border-puce"
                  )}
                  value="photo"
                >
                  Foto
                </TabsTrigger>
                <TabsTrigger
                  className={cn(
                    "w-full text-start inline-block",
                    "data-[state=active]:text-puce data-[state=active]:border-l-4 data-[state=active]:border-puce"
                  )}
                  value="follower"
                >
                  Follower
                </TabsTrigger>
              </TabsList>
              <TabsContent value="review" className="w-2/3">
                <Review />
              </TabsContent>
              <TabsContent value="photo">Foto</TabsContent>
              <TabsContent value="follower">
                <Follower />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <Edit isOpen={openEdit} setIsOpen={setOpenEdit} value={dataUser} />
      </>
    )
  );
}

export default Client;
