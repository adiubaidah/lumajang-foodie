"use client";
import { SetStateAction, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, SquarePen, SquarePlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  axiosInstance,
  createQueryString,
  humanizeIdTime,
  imageFromBackend,
} from "~/lib/utils";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { NewMenuReview, MenuReview, User } from "~/types";
import { Button } from "~/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { menuReviewSchema } from "~/schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { RatingStar } from "~/components/ready-use/rating-star";
import toast from "react-hot-toast";
import { Badge } from "~/components/ui/badge";
import { Star } from "~/icons";
import PaginationComponent from "~/components/ready-use/pagination-button";
import { Separator } from "~/components/ui/separator";
import useAuth from "~/hooks/useAuth";
import { BadgeRate } from "~/components/ready-use/badge-rate";
import { ButtonFollow } from "~/components/ready-use/button-follow";

type Review = MenuReview & { user: User } & { updatedAt: string };

function Ulasan() {
  const [page, setPage] = useState(1);
  const params = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { data: detail } = useQuery({
    queryKey: ["menu", params.slug],
    queryFn: async () => {
      return (await axiosInstance.get(`/menu/find?slug=${params.slug}`)).data;
    },
    enabled: !!params.slug,
  });
  const { data, isLoading } = useQuery({
    queryKey: ["menu-review", { menu: detail.id, page, auth: user && user.id }],
    queryFn: async () => {
      const query = createQueryString({
        menu: detail.id,
        ...(!!user &&
          !!user.id && {
            "current-user": user.id,
          }),
      });
      return (await axiosInstance.get(`/menu-review?${query}`)).data;
    },
    staleTime: 1000 * 5 * 60,
    enabled: !!detail.id,
  });
  return (
    <div className="bg-white p-7 shadow-lg">
      <ReviewModal menu={detail.id} />
      <div className="flex flex-col gap-y-7">
        {isLoading || !data
          ? "Loading"
          : data && data.result
            ? data.result.map((review: Review) => (
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
                  <p className="mt-3 font-light text-black">{review.review}</p>
                  <Separator className="mt-3" />
                  <div className="flex">
                    <ButtonFollow user={review.user.id} />
                  </div>
                </div>
              ))
            : "Data tidak ditemukan"}
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

export const ReviewModal = ({ menu }: { menu: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<NewMenuReview>({
    resolver: zodResolver(menuReviewSchema),
    defaultValues: {
      star: 0,
      menuId: "",
      review: "",
    },
  });

  useEffect(() => {
    form.setValue("menuId", menu);
  }, [form, menu]);

  const reviewMutation = useMutation({
    mutationFn: async (payload: NewMenuReview) => {
      return axiosInstance
        .put("menu-review", payload)
        .then((data) => data.data);
    },
    onSettled: () => {
      setIsOpen(false);
    },
    onSuccess: () => {
      toast.success("Review berhasil diupdate");
    },
    onError: () => {
      toast.error("Review gagal diupdate");
    },
  });

  const onSubmit = (values: NewMenuReview) => {
    reviewMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="flex items-center space-x-2 text-davy"
          type="button"
        >
          <SquarePen color="#F97300" />
          <span className="text-lg">Tulis Ulasan Anda</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <div>
          <DialogHeader className="mb-3">
            <DialogTitle className="font-medium">Tambah Ulasan</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="review"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ulasan Anda</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Ketik disini" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="star"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Berikan Rating</FormLabel>
                    <FormControl>
                      <RatingStar
                        rating={field.value}
                        setRating={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="float-right w-28 bg-soft-red hover:bg-soft-red/90"
                disabled={reviewMutation.isPending}
              >
                {reviewMutation.isPending ? (
                  <Loader2 className="mx-auto animate-spin" />
                ) : (
                  <span>Kirim</span>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
