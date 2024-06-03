"use client";
import { useState } from "react";
import { MapPin, Pencil } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { cn, imageFromBackend } from "~/lib/utils";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { useAuth } from "~/hooks";
import { axiosInstance } from "~/lib/utils";
import { UserComplete } from "~/types";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Edit from "./components/edit";
import { Review } from "./components";
import Connection from "./components/connections/connection";

function Client() {
  const [openEdit, setOpenEdit] = useState(false);
  const { user } = useAuth();
  const { data: dataUser } = useQuery<UserComplete>({
    queryKey: ["user", { user: user && user.id }],
    queryFn: async () => {
      return (await axiosInstance.get(`/user/${user.id}`)).data;
    },
    staleTime: Infinity,
  });
  return (
    dataUser && (
      <>
        <div className="container max-w-full">
          <div
            className={cn(
              "relative flex h-[220px] items-center justify-between bg-center bg-no-repeat px-4 text-white",
              "bg-gray-800",
              // `bg-[url('${imageFromBackend(
              //   dataUser.backgroundImage ?? "public/img/place/default.PNG"
              // )}')]`
            )}
          >
            <div className="flex items-center gap-x-3">
              <SkeletonImage
                src={imageFromBackend(
                  dataUser.image ?? "public/img/user/default.png",
                )}
                className="h-40 w-40 rounded-full border-2"
                alt={dataUser.name}
                width={400}
                height={400}
              />
              <div>
                <h3 className="font-medium">{dataUser.name}</h3>
                {!!dataUser.subdistrict && (
                  <span className="mt-2 flex items-center">
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
              <div className="mt-4 flex gap-x-3">
                <div className="text-center">
                  <span className="text-2xl font-medium">
                    {dataUser._count.placeReviews + dataUser._count.menuReviews}
                  </span>
                  <p className="text-[16px]">Ulasan</p>
                </div>
                <div className="border-r-2" />
                <div className="text-center">
                  <span className="text-2xl font-medium">
                    {dataUser._count.followers}
                  </span>
                  <p className="text-[16px]">Pengikut</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Tabs defaultValue="review" className="flex items-center">
              <TabsList className="mt-20 flex w-1/3 flex-col gap-y-4 bg-transparent p-0">
                <TabsTrigger
                  className={cn(
                    "inline-block w-full text-start",
                    "data-[state=active]:border-l-4 data-[state=active]:border-puce data-[state=active]:text-puce",
                  )}
                  value="review"
                >
                  Ulasan
                </TabsTrigger>
                <TabsTrigger
                  className={cn(
                    "inline-block w-full text-start",
                    "data-[state=active]:border-l-4 data-[state=active]:border-puce data-[state=active]:text-puce",
                  )}
                  value="photo"
                >
                  Foto
                </TabsTrigger>
                <TabsTrigger
                  className={cn(
                    "inline-block w-full text-start",
                    "data-[state=active]:border-l-4 data-[state=active]:border-puce data-[state=active]:text-puce",
                  )}
                  value="connection"
                >
                  Koneksi
                </TabsTrigger>
              </TabsList>
              <TabsContent value="review" className="w-2/3">
                <Review />
              </TabsContent>
              <TabsContent value="photo">Foto</TabsContent>
              <TabsContent value="connection">
                <Connection />
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
