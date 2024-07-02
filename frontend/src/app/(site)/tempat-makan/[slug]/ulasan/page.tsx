"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Review from "~/../public/assets/review.svg";
import { cn } from "~/lib/utils";
import {
  axiosInstance,
  createQueryString,
  humanizeIdTime,
  imageFromBackend,
} from "~/lib/utils";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { PlaceReview, User } from "~/types";

import { ReviewModal } from "./review-modal";
import PaginationComponent from "~/components/ready-use/pagination-button";
import { Separator } from "~/components/ui/separator";
import useAuth from "~/hooks/useAuth";
import { BadgeRate } from "~/components/ready-use/badge-rate";
import { ButtonFollow } from "~/components/ready-use/button-follow";
import Loader from "~/components/ready-use/loader";

type Review = PlaceReview & { user: User } & { updatedAt: string };

function Ulasan() {
  const [page, setPage] = useState(1);
  const params = useParams<{ slug: string }>();
  const [tempatMakanId, setTempatMakanId] = useState("");
  const { user } = useAuth();
  const { data: detail } = useQuery({
    queryKey: ["place", params.slug],
    queryFn: async () => {
      const response = (
        await axiosInstance.get(`/place/find?slug=${params.slug}`)
      ).data;
      setTempatMakanId(response.id);
      return response;
    },
    enabled: !!params.slug,
  });

  const { data: currentUserReview, isLoading: isLoadingCurrentUserReview } =
    useQuery({
      queryKey: [
        "place-review",
        "find-current-user-review",
        { place: detail.id, auth: user && user.id },
      ],
      queryFn: async () => {
        if (!user) return null;

        const query = createQueryString({
          place: detail.id,
          ...(!!user &&
            !!user.id && {
              "current-user": user.id,
            }),
        });
        return (await axiosInstance.get(`/place-review/find?${query}`)).data;
      },
    });

  const { data, isLoading } = useQuery({
    queryKey: [
      "place-review",
      { place: detail.id, perPage: 5, page, auth: user && user.id },
    ],
    queryFn: async () => {
      const query = createQueryString({
        place: detail.id,
        perPage: 5,
        ...(!!user &&
          !!user.id && {
            "current-user": user.id,
          }),
      });
      return (await axiosInstance.get(`/place-review?${query}`)).data;
    },
    enabled: !!detail.id,
  });

  return (
    <div className="bg-white p-7 shadow-lg">
      {!isLoadingCurrentUserReview && !currentUserReview && (
        <ReviewModal placeId={params.slug} />
      )}
      <div className="flex flex-col gap-y-7">
        {!data || isLoading ? (
          <div>
            <Loader />
          </div>
        ) : data && data.result.length > 0 ? (
          data.result.map((review: Review) => (
            <div
              key={review.id}
              className="rounded-md border-[1px] border-orange p-4 shadow-[0px_4px_8px_0px_rgba(10,58,100,0.15)]"
            >
              <div className="flex items-center gap-x-3">
                <SkeletonImage
                  src={imageFromBackend(
                    review.user.image ?? "public/img/user/default.png",
                  )}
                  height={40}
                  width={40}
                  className="rounded-full"
                  alt={review.user.id}
                />
                <span className="text-lg font-medium">{review.user.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-thin">
                  {humanizeIdTime(review.updatedAt)}
                </span>
                <BadgeRate rate={review.star} />
              </div>
              <p className="mt-3 font-light text-black">{review.review}</p>
              <Separator className="mt-3" />
              <div className="flex">
                <ButtonFollow user={review.user.id} />
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center mt-6">
            <Review height={100} width={100} />
            <p className="text-center text-gray-500 font-helvetica text-xl">Belum ada review</p>
          </div>
        )}
      </div>
      <div className="mt-4">
        {data && data.pagination.pageCount > 1 && (
          <PaginationComponent
            data={data.pagination}
            page={page}
            setPage={setPage}
          />
        )}
      </div>
    </div>
  );
}

export default Ulasan;
