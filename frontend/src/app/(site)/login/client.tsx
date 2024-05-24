"use client";

import Image from "next/image";
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
import { Separator } from "~/components/ui/separator";
import { Anchor } from "~/components/ui/anchor";
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
    <div className="h-screen w-full flex items-center">
      <div className="w-full h-full md:max-w-md px-5 bg-white shadow-xl flex flex-col items-center justify-center">
        <Image
          src="/assets/logo.png"
          alt="lumajang foodie"
          height={400}
          width={400}
          className="w-[297px] h-[109px]"
        />
        <h3 className="font-bold text-xl my-3">Login ke Akun Anda</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 w-full space-y-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-[16px] text-davy">Email *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      className="bg-[#F1F3F6] focus-visible:ring-0"
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
                  <FormLabel className="text-[16px] text-davy">Password *</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="*****"
                      className="bg-[#F1F3F6] focus-visible:ring-0"
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
                className="font-bold rounded-md w-full px-[35px] h-[45.6px] shadow-[0_8px_12px_rgba(249,116,0,0.3)]"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  <span>Sign in Now</span>
                )}
              </Button>
              <div className="flex items-center w-full justify-between my-3">
                <Separator className="w-1/3" />
                <span className="inline-block text-stroke">OR</span>
                <Separator className="w-1/3" />
              </div>
              <Link
                href="register"
                className="rounded-md w-full text-orange border-[1px] px-[35px] h-[45.6px] text-center border-orange leading-[45.6px]"
              >
                Sign up Now
              </Link>
            </div>
          </form>
        </Form>
      </div>
      <div className="hidden md:flex items-center justify-center w-full">
        {/* <LoginIlustrator /> */}
        <Image
          src="/assets/login-illustrator.jpg"
          width={500}
          height={500}
          className="w-[400px] h-auto object-cover mix-blend-multiply"
          alt="login"
        />
      </div>
    </div>
  );
}

export default Client;
