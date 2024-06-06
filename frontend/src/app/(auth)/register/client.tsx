"use client";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { axiosInstance } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";
import PasswordInput from "~/components/ready-use/password-input";
import { registerSchema } from "~/schema";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Register } from "~/types";
function Client() {
  const router = useRouter();
  const form = useForm<Register>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });
  const registerMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: (payload: Register) => {
      return axiosInstance.post("/auth/register", payload);
    },
    onSuccess: ({ data }) => {
      toast.success("Registrasi sukses");
      router.push("/login");
    },
    onError: (data) => {
      toast.error("Registrasi gagal");
    },
  });
  function onSubmit(values: Register) {
    registerMutation.mutate(values);
  }
  return (
    <div className="flex min-h-screen w-full items-center">
      <div className="flex h-full w-full flex-col items-center justify-center bg-white px-5 shadow-xl md:max-w-md">
        <Image
          src="/assets/logo.png"
          alt="lumajang foodie"
          height={400}
          width={400}
          className="h-[109px] w-[297px]"
        />
        <h3 className="my-3 text-xl font-bold">Login ke Akun Anda</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 w-full space-y-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-[16px] text-davy">
                    Nama Lengkap *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ahmad Adi"
                      className="bg-[#F1F3F6] focus-visible:ring-0"
                      {...field}
                      disabled={registerMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-[16px] text-davy">
                    Email *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="iskandar@gmail.com"
                      className="bg-[#F1F3F6] focus-visible:ring-0"
                      {...field}
                      disabled={registerMutation.isPending}
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
                  <FormLabel className="text-[16px] text-davy">
                    Password *
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="*****"
                      className="bg-[#F1F3F6] focus-visible:ring-0"
                      {...field}
                      disabled={registerMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-[16px] text-davy">
                    Konfirmasi Password *
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="*****"
                      className="bg-[#F1F3F6] focus-visible:ring-0"
                      {...field}
                      disabled={registerMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 flex flex-col items-center gap-y-3">
              <Button
                type="submit"
                className="h-[45.6px] w-full rounded-md px-[35px] font-bold shadow-[0_8px_12px_rgba(249,116,0,0.3)]"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <Loader2 className="mx-auto animate-spin" />
                ) : (
                  <span>Sign Up Now</span>
                )}
              </Button>
              <div className="my-1 flex w-full items-center justify-between">
                <Separator className="w-1/3" />
                <span className="inline-block text-stroke">OR</span>
                <Separator className="w-1/3" />
              </div>
              <Link
                href="login"
                className="h-[45.6px] w-full rounded-md border-[1px] border-orange px-[35px] text-center leading-[45.6px] text-orange"
              >
                Sign in Now
              </Link>
            </div>
          </form>
        </Form>
      </div>
      <div className="hidden w-full items-center justify-center md:flex">
        {/* <LoginIlustrator /> */}
        <Image
          src="/assets/login-illustrator.jpg"
          width={500}
          height={500}
          className="h-auto w-[400px] object-cover mix-blend-multiply"
          alt="login"
        />
      </div>
    </div>
  );
}

export default Client;
