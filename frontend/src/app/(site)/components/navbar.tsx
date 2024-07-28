"use client";
import React from "react";
import Link from "next/link";
import {
  ChevronDown,
  MessageCircle,
  MessageCircleMore,
  Search,
} from "lucide-react";
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
import SearchInput from "~/components/ready-use/search-input";

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
        "container z-20 max-w-full flex-col items-center justify-between gap-x-3 bg-poteh pb-3 pt-5 font-semibold uppercase md:flex-row",
        path === "/register" || path === "/login" ? "hidden" : "md:flex",
      )}
    >
      <Image
        src="/assets/logo.png"
        alt="Lumajang Foodie"
        width={200}
        height={200}
        className="h-[44px] w-auto lg:h-14"
      />
      <div className="hidden w-full md:block">
        <SearchInput />
      </div>

      <ul className="hidden gap-x-5 md:flex">
        {user ? (
          <React.Fragment>
            <li>
              <Link href={"/chat"}>
                <MessageCircleMore
                  width={40}
                  height={40}
                  className="text-puce"
                />
              </Link>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-x-3">
                  <SkeletonImage
                    src={imageFromBackend(user.image ?? "/assets/avatar.png")}
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
                  <DropdownMenuItem asChild>
                    <Link href={"/chat"}>Chat</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/register">Registrasi</Link>
            </li>
          </React.Fragment>
        )}
      </ul>
    </header>
  );
}

export default Navbar;
