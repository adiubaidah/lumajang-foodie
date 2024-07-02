"use client";
import { useMutation } from "@tanstack/react-query";
import { Loader2, SendHorizonal } from "lucide-react";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useConversation } from "~/hooks";
import { axiosInstance } from "~/lib/utils";
function Form() {
  const { conversationId } = useConversation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const messageMutation = useMutation({
    mutationFn: async (message) => {
      return (
        await axiosInstance.post(`/message`, {
          body: message,
          conversationId,
        })
      ).data;
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    messageMutation.mutate(data.message);
  };

  return (
    <div className="flex h-fit w-full items-center gap-2 border-t-gray bg-white px-4 py-4 lg:gap-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full items-center gap-2 lg:gap-4"
      >
        <Input
          id="message"
          {...register("message", {
            required: { message: "Pesan tidak valid", value: true },
          })}
          required
          placeholder="Tulis pesan..."
          disabled={messageMutation.isPending}
        />
        <Button
          type="submit"
          className="cursor-pointer rounded-full bg-puce p-2"
        >
          {messageMutation.isPending ? (
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
