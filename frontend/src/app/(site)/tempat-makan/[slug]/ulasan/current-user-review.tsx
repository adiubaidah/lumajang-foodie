import React, { useState,useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { placeReviewSchema } from "~/schema";
import { NewPlaceReview } from "~/types";
import { Loader2, SquarePen } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { RatingStar } from "~/components/ready-use/rating-star";
import { axiosInstance } from "~/lib/utils";

export default function CurrentUserReview({ place }: { place: string }) {
  const { data } = useQuery({
    queryKey: ["current-user-review", place],
    queryFn: async () => {
      return (await axiosInstance.get("/place-review/current-user-review"))
        .data;
    },
  });
  return <div>CurrentUserReview</div>;
}

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
