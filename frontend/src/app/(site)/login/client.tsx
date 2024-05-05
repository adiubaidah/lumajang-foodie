"use client";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { axiosInstance } from "~/lib/utils";
import PasswordInput from "~/components/ready-use/password-input";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Login } from "~/types";
import { loginSchema } from "~/schema";
function Client() {
  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (payload: Login) => {
      return axiosInstance.post("/auth/login", payload);
    },
    onSuccess: ({ data }) => {
      toast.success("Login sukses");
    },
    onError: (data) => {
      toast.error("Login gagal");
    },
  });
  function onSubmit(values: Login) {
    loginMutation.mutate(values);
  }
  return (
    <div className="h-screen grid place-items-center w-full">
      <div className="w-full max-w-md">
        <h1 className="font-bold uppercase text-center text-2xl">Login</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      disabled={loginMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="*****"
                      {...field}
                      disabled={loginMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 flex flex-col items-center gap-y-3">
              <Button
                type="submit"
                className="font-bold rounded-full uppercase px-[35px] h-[45.6px]"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  <span>Login</span>
                )}
              </Button>
              <p>
                Belum registrasi ?{" "}
                <Link
                  href="/auth/register"
                  className="hover:text-primary duration-200"
                >
                  Registrasi
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Client;
