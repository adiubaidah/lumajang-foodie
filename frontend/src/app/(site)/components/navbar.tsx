"use client";
import React from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { User, Heart } from "lucide-react";
import { axiosInstance, cn, imageFromBackend } from "~/lib/utils";
import { useScrollPosition, useAuth } from "~/hooks";
import { Button } from "~/components/ui/button";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

function Navbar() {
  const user = useAuth();
  const path = usePathname();
  const yAxis = useScrollPosition();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return (await axiosInstance.post("/auth/logout")).data;
    },
    onSuccess: () => {
      window.location.reload();
    },
    onError: () => {
      toast.error("Gagal logout");
    },
  });

  return (
    <header
      className={cn(
        "container bg-poteh max-w-full flex flex-col md:flex-row items-center justify-between uppercase font-semibold pt-5 pb-3 z-20",
        yAxis > 10 &&
          "fixed shadow-md -top-12 transition duration-500 translate-y-[48px] max-w-full",
        (path === "/register" || path === "/login") && "hidden"
      )}
    >
      <Image
        src="/assets/logo.png"
        alt="Lumajang Foodie"
        width={300}
        height={300}
        className="w-[176px]"
      />
      <div className="mt-3 w-full bg-white flex items-center space-x-3 max-w-lg shadow-[0_4px_4px_rgba(0,0,0,0.25)] py-3 px-2 rounded-lg">
        <Search />
        <input
          type="text"
          placeholder="Cari makanan atau tempat makan"
          className="w-full outline-none placeholder:text-stroke placeholder:font-thin"
        />
      </div>

      <ul className="hidden md:flex gap-x-5">
        {user ? (
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-x-3">
                <SkeletonImage
                  src={imageFromBackend(
                    user.image ?? "public/img/user/default.png"
                  )}
                  alt={user.name}
                  height={100}
                  width={100}
                  className="rounded-full w-10 h-10"
                  skeletonStyle={{
                    width: 40,
                    height: 40,
                    borderRadius: "100%",
                  }}
                />
                <ChevronDown />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="z-30">
                <DropdownMenuItem asChild>
                  <Link href={"/my-profile"}>Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Ulasan</DropdownMenuItem>
                <DropdownMenuItem>Pesan</DropdownMenuItem>
                <DropdownMenuItem>Koneksi Saya</DropdownMenuItem>
                <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ) : (
          <>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/register">Registrasi</Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Navbar;
