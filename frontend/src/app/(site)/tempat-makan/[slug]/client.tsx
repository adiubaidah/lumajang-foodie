"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { BadgeRate } from "~/components/ready-use/badge-rate";
import { Review, Photo, Overview } from "./components";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  axiosInstance,
  getClosingTime,
  getOpeningTime,
  isOpen,
  cn,
  imageFromBackend,
} from "~/lib/utils";
import { useMediaQuery } from "~/hooks";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import { Badge } from "~/components/ui/badge";

function Client() {
  const { slug } = useParams();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [photoPage, setPhotoPage] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const { data: detail } = useQuery({
    queryKey: ["place", slug],
    queryFn: async () => {
      return axiosInstance
        .get(`/place/find?slug=${slug}`)
        .then((data) => data.data);
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });

  const { data: imagePreview } = useQuery({
    queryKey: ["place-photo", { place: detail && detail.id }, "preview"],
    queryFn: async () => {
      return axiosInstance
        .get(`/place-photo?place=${detail.id}&perPage=4`)
        .then((data) => data.data);
    },
    enabled: !!detail && !!detail.id,
    staleTime: 1000 * 60 * 5,
  });

  // return JSON.stringify(detail);
  return (
    <div className="container max-w-full py-3 h-[5000px]">
      {imagePreview && imagePreview.result && (
        <>
          {!isDesktop ? (
            <Carousel>
              <CarouselContent className="h-[300px]">
                <CarouselItem>
                  <SkeletonImage
                    src={imageFromBackend(imagePreview.result[0].url)}
                    height={500}
                    width={500}
                    className="w-full h-full object-cover"
                    alt="preview-1"
                  />
                </CarouselItem>
                <CarouselItem>
                  <SkeletonImage
                    src={imageFromBackend(imagePreview.result[1].url)}
                    height={500}
                    width={500}
                    className="w-full h-full object-cover"
                    alt="preview-2"
                  />
                </CarouselItem>
                <CarouselItem>
                  <SkeletonImage
                    src={imageFromBackend(imagePreview.result[2].url)}
                    height={500}
                    width={500}
                    className="w-full h-full object-cover"
                    alt="preview-3"
                  />
                </CarouselItem>
                <CarouselItem>
                  <SkeletonImage
                    src={imageFromBackend(imagePreview.result[3].url)}
                    height={500}
                    width={500}
                    className="w-full h-full object-cover"
                    alt="preview-4"
                  />
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          ) : (
            <div className="w-full h-[350px] flex items-center space-x-2">
              <div className="h-full w-3/5">
                <SkeletonImage
                  src={imageFromBackend(imagePreview.result[0].url)}
                  height={500}
                  width={500}
                  className="w-full h-full object-cover"
                  alt="preview-1"
                />
              </div>
              <div className="w-2/5 h-full items-center flex gap-x-2">
                <div className="w-1/2 h-full flex flex-col gap-y-2">
                  <SkeletonImage
                    src={imageFromBackend(imagePreview.result[1].url)}
                    height={500}
                    width={500}
                    className="h-1/2"
                    alt="preview-1"
                  />
                  <SkeletonImage
                    src={imageFromBackend(imagePreview.result[2].url)}
                    height={500}
                    width={500}
                    className="h-1/2"
                    alt="preview-1"
                  />
                </div>
                <div className="w-1/2 h-full">
                  <SkeletonImage
                    src={imageFromBackend(imagePreview.result[3].url)}
                    height={500}
                    width={500}
                    className="h-full object-cover"
                    alt="preview-3"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-normal">{detail.name}</h1>
          <div className="flex items-center gap-x-2">
            <BadgeRate rate={detail.rate._avg.star} />
            <div className="flex flex-col">
              <span className="text-davy">{detail.rate._count.id}</span>
              <span className="font-light text-davy">Ulasan</span>
            </div>
          </div>
        </div>
        <p className="font-light text-2xl text-davy">{detail.address}</p>
        <div className="text-davy font-light flex gap-x-2">
          {isOpen(detail.openingHours) ? (
            <>
              <span className="text-islamic">Buka</span>-
              <span>Tutup jam {getClosingTime(detail.openingHours)}</span>
            </>
          ) : (
            <>
              <span className="text-puce">Tutup</span>-
              <span>Buka Jam {getOpeningTime(detail.openingHours)}</span>
            </>
          )}
        </div>

        <div className="flex"></div>
      </div>
      {/* Komponen */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-transparent after:w-full after:h-1 after:bg-stroke mb-3">
          <TabsTrigger
            value="overview"
            className={cn(
              "data-[state=active]:border-b-2 data-[state=active]:border-puce data-[state=active]:bg-transparent data-[state=active]:text-puce data-[state=active]:",
              "font-light text-davy text-xl py-3 px-5"
            )}
          >
            Sekilas
          </TabsTrigger>
          <TabsTrigger
            value="review"
            className={cn(
              "data-[state=active]:border-b-2 data-[state=active]:border-puce data-[state=active]:bg-transparent data-[state=active]:text-puce data-[state=active]:",
              "font-light text-davy text-xl py-3 px-5"
            )}
          >
            Ulasan
          </TabsTrigger>
          <TabsTrigger
            value="photo"
            className={cn(
              "data-[state=active]:border-b-2 data-[state=active]:border-puce data-[state=active]:bg-transparent data-[state=active]:text-puce data-[state=active]:",
              "font-light text-davy text-xl py-3 px-5"
            )}
          >
            Foto
          </TabsTrigger>
          <TabsTrigger
            value="menu"
            className={cn(
              "data-[state=active]:border-b-2 data-[state=active]:border-puce data-[state=active]:bg-transparent data-[state=active]:text-puce data-[state=active]:",
              "font-light text-davy text-xl py-3 px-5"
            )}
          >
            Menu
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Overview detail={detail} />
        </TabsContent>
        <TabsContent value="review">
          <h2 className="text-3xl font-normal mb-3">Review</h2>
          <Review
            page={reviewPage}
            setPage={setReviewPage}
            placeId={detail.id}
          />
        </TabsContent>
        <TabsContent value="photo">
          <Photo page={photoPage} setPage={setPhotoPage} placeId={detail.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Client;
