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
function Password() {
  const form = useForm<EditPassword>({
    resolver: zodResolver(editPasswordSchema),
    defaultValues: {
      confirm_new_password: "",
      new_password: "",
      old_password: "",
    },
  });

  const editPasswordMutation = useMutation({
    mutationFn: async (payload: EditPassword) => {
      // return axiosInstance.put()
    },
  });

  const onSubmit = (values: EditPassword) => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          name="old_password"
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
          name="new_password"
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
          name="confirm_new_password"
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
