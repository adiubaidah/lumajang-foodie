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
  const { user } = useAuth();
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
        "container z-20 max-w-full flex-col items-center justify-between bg-poteh pb-3 pt-5 font-semibold uppercase md:flex-row",
        yAxis > 10 &&
          "fixed -top-12 max-w-full translate-y-[48px] shadow-md transition duration-500",
        path === "/register" || path === "/login" ? "hidden" : "md:flex",
      )}
    >
      <Image
        src="/assets/logo.png"
        alt="Lumajang Foodie"
        width={200}
        height={200}
        className="h-[44px] lg:h-14 w-auto"
      />
      <div className="mt-3 flex w-full max-w-lg items-center space-x-3 rounded-lg bg-white px-2 py-3 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
        <Search />
        <input
          type="text"
          placeholder="Cari makanan atau tempat makan"
          className="w-full outline-none placeholder:font-thin placeholder:text-stroke"
        />
      </div>

      <ul className="hidden gap-x-5 md:flex">
        {user ? (
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-x-3">
                <SkeletonImage
                  src={imageFromBackend(
                    user.image ?? "public/img/user/default.png",
                  )}
                  alt={user.name}
                  height={100}
                  width={100}
                  className="h-10 w-10 rounded-full"
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
                <DropdownMenuItem asChild>
                  <Link href={"/my-profile/ulasan"}>Ulasan</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={"/my-profile/koneksi"}>Koneksi Saya</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Pesan</DropdownMenuItem>
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
