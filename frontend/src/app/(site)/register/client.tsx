"use client";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { axiosInstance } from "~/lib/utils";
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
    <div className="h-screen grid place-items-center w-full">
      <div className="w-full max-w-md">
        <h1 className="font-bold uppercase text-center text-2xl">Register</h1>
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
                      disabled={registerMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nama Lengkap *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="nama"
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
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="*****"
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
                  <FormLabel>Konfirmasi Password *</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="*****"
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
                className="font-bold rounded-full uppercase px-[35px] h-[45.6px]"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  <span>Registrasi</span>
                )}
              </Button>
              <p>
                Sudah memiliki akun ?{" "}
                <Link href="/login" className="hover:text-primary duration-200">
                  Login
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
