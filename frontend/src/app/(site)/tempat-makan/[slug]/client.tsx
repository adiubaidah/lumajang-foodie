"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { Review, Photo } from "./components";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { axiosInstance } from "~/lib/utils";

function Client() {
  const { slug } = useParams();
  const [photoPage, setPhotoPage] = useState(0);
  const [reviewPage, setReviewPage] = useState(0);
  const { data: detail } = useQuery({
    queryKey: ["place", slug],
    queryFn: async () => {
      return axiosInstance
        .get(`/place/find?slug=${slug}`)
        .then((data) => data.data);
    },
    // enabled: !!slug
    staleTime: 1000 * 60 * 5,
  });

  const { data: imagePreview } = useQuery({
    queryKey: ["place-photo", { place: detail.id }, "preview"],
    queryFn: async () => {
      return axiosInstance
        .get(`/place-photo?place=${detail.id}&perPage=4`)
        .then((data) => data.data);
    },
    enabled: !!detail.id,
    staleTime: 1000 * 60 * 5,
  });

  // return JSON.stringify(detail);
  return (
    <div className="py-3">
      {imagePreview && imagePreview.result && (
        <div className="w-full h-[350px] flex items-center space-x-2">
          <div className="h-full w-3/5">
            <SkeletonImage
              src={imagePreview.result[0].url}
              height={500}
              width={500}
              className="w-full h-full object-cover"
              alt="preview-1"
            />
          </div>
          <div className="w-2/5 h-full items-center flex gap-x-2">
            <div className="w-1/2 h-full flex flex-col gap-y-2">
              <SkeletonImage
                src={imagePreview.result[1].url}
                height={500}
                width={500}
                className="h-1/2"
                alt="preview-1"
              />
              <SkeletonImage
                src={imagePreview.result[2].url}
                height={500}
                width={500}
                className="h-1/2"
                alt="preview-1"
              />
            </div>
            <div className="w-1/2 h-full">
              <SkeletonImage
                src={imagePreview.result[3].url}
                height={500}
                width={500}
                className="h-full object-cover"
                alt="preview-3"
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex">
          <h1 className="text-4xl font-medium">{detail.name}</h1>
        </div>
      </div>
      {/* Komponen */}
      <Tabs>
        <TabsList defaultValue="overview">
          <TabsTrigger value="overview">Sekilas</TabsTrigger>
          <TabsTrigger value="review">Ulasan</TabsTrigger>
          <TabsTrigger value="photo">Foto</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <h2>Tentang tempat makan ini</h2>
          <div dangerouslySetInnerHTML={{ __html: detail.description }} />
        </TabsContent>
        <TabsContent value="review">
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
