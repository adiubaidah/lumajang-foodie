"use client";
import { useMutation } from "@tanstack/react-query";
import { Loader2, SendHorizonal } from "lucide-react";

import PlaceSearcher from "./place-searcher";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useConversation } from "~/hooks";
import { axiosInstance } from "~/lib/utils";
import { placeFeature } from "~/constant";
function Form() {
  const { conversationId } = useConversation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: undefined,
      placeId: undefined,
    },
  });

  const genericMutation = useMutation({
    mutationFn: async (data: { message?: string; placeId?: string }) => {
      const payload = {
        body: data.message ?? undefined,
        placeId: data.placeId ?? undefined,
        conversationId,
      };

      return (await axiosInstance.post(`/message`, payload)).data;
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    genericMutation.mutate({ message: data.message });
  };

  const handlePlaceSearcherSubmit = (placeId: string) => {
    setValue("placeId", placeId);
    genericMutation.mutate({ placeId });
  };

  return (
    <div className="border-t-gray flex h-fit w-full items-center gap-2 bg-white px-4 py-4 lg:gap-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full items-center gap-2 lg:gap-4"
      >
        <PlaceSearcher handleSubmit={handlePlaceSearcherSubmit} />
        <Input
          id="message"
          {...register("message", {
            required: { message: "Pesan tidak valid", value: true },
          })}
          required
          placeholder="Tulis pesan..."
          disabled={genericMutation.isPending}
        />
        <Button
          type="submit"
          className="cursor-pointer rounded-full bg-puce p-2"
        >
          {genericMutation.isPending ? (
            <Loader2 className="animate-spin text-white" />
          ) : (
            <SendHorizonal width={22} height={20} className="text-white" />
          )}
        </Button>
      </form>
    </div>
  );
}

export default Form;
