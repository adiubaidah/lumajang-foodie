import { SetStateAction, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2, SquarePen, SquarePlus } from "lucide-react";

import { rateColor } from "~/constant";
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
import { NewPlace, NewPlaceReview, PlaceReview, User } from "~/types";
import { Button } from "~/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { placeReviewSchema } from "~/schema";
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

export type ReviewProps = {
  placeId: string;
  page: number;
  setPage: React.Dispatch<SetStateAction<number>>;
};

type Review = PlaceReview & { user: User } & { updatedAt: string };

function Review({ placeId, page, setPage }: ReviewProps) {
  const auth = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["place-review", { place: placeId, page, auth: "" }],
    queryFn: async () => {
      const query = createQueryString({
        place: placeId,
        ...(!!auth &&
          auth.id && {
            "current-user": auth.id,
          }),
      });
      return (await axiosInstance.get(`/place-review?${query}`)).data;
    },
    staleTime: 1000 * 5 * 60,
    enabled: !!placeId,
  });
  return (
    <div className="bg-white shadow-lg p-7">
      <ReviewModal place={placeId} />
      <div className="flex flex-col gap-y-7">
        {isLoading
          ? "Loading"
          : data && data.result
          ? data.result.map((review: Review) => (
              <div
                key={review.id}
                className="border-orange border-[1px] p-4 rounded-md shadow-[0px_4px_8px_0px_rgba(10,58,100,0.15)]"
              >
                <div className="flex items-center gap-x-3">
                  <SkeletonImage
                    src={imageFromBackend(
                      review.user.image ?? "public/img/user/default.png"
                    )}
                    height={40}
                    width={40}
                    className="rounded-full"
                    alt={review.user.id}
                  />
                  <span className="font-medium text-lg">
                    {review.user.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-thin text-[14px]">
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

export default Review;

export const ReviewModal = ({ place }: { place: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<NewPlaceReview>({
    resolver: zodResolver(placeReviewSchema),
    defaultValues: {
      star: 0,
      placeId: "",
      review: "",
    },
  });

  useEffect(() => {
    form.setValue("placeId", place);
  }, [form, place]);

  const reviewMutation = useMutation({
    mutationFn: async (payload: NewPlaceReview) => {
      return axiosInstance
        .put("place-review", payload)
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

  const onSubmit = (values: NewPlaceReview) => {
    reviewMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="flex items-center text-davy space-x-2"
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
                className="bg-soft-red float-right hover:bg-soft-red/90 w-28"
                disabled={reviewMutation.isPending}
              >
                {reviewMutation.isPending ? (
                  <Loader2 className="animate-spin mx-auto" />
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
