"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormDescription,
  FormMessage,
  FormLabel,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "~/hooks";
import { axiosInstance, imageFromBackend } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import PasswordInput from "~/components/ready-use/password-input";
import { editPasswordSchema } from "~/schema";
import { EditPassword } from "~/types";
import { AxiosError, AxiosResponse } from "axios";
function Password() {
  const form = useForm<EditPassword>({
    resolver: zodResolver(editPasswordSchema),
    defaultValues: {
      newPassword: "",
      oldPassword: "",
      confirmNewPassword: "",
    },
  });

  const editPasswordMutation = useMutation({
    mutationFn: async (payload: EditPassword) => {
      return (await axiosInstance.put("/user/update-password", payload)).data;
    },
    onSuccess: () => {
      toast.success("Password berhasil diubah");
      form.reset({
        newPassword: "",
        oldPassword: "",
        confirmNewPassword: "",
      });
    },
    onError: (err: AxiosError) => {
      toast.error((err.response?.data as any)?.message || "Terjadi kesalahan");
    },
  });

  const onSubmit = (values: EditPassword) => {
    editPasswordMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          name="oldPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Lama</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  disabled={editPasswordMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="newPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Baru</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  disabled={editPasswordMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirmNewPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfirmasi Password Baru</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  disabled={editPasswordMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="h-[45.6px] rounded-md px-[35px] font-bold shadow-[0_8px_12px_rgba(249,116,0,0.3)]"
          disabled={editPasswordMutation.isPending}
        >
          {editPasswordMutation.isPending ? (
            <Loader2 className="mx-auto animate-spin" />
          ) : (
            <span>Update</span>
          )}
        </Button>
      </form>
    </Form>
  );
}

export default Password;
