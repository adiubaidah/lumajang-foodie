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
import { cn, imageFromBackend } from "~/lib/utils";
import { useScrollPosition, useUser } from "~/hooks";
import { Button } from "~/components/ui/button";
import SkeletonImage from "~/components/ready-use/skeleton-image";

function Navbar() {
  const user = useUser();
  const yAxis = useScrollPosition();
  return (
    <header
      className={cn(
        "container max-w-full bg-red-200 flex flex-col md:flex-row items-center justify-between uppercase font-semibold pt-5 pb-3 ",
        yAxis > 10 &&
          "fixed shadow-md -top-12 transition duration-500 translate-y-[48px] max-w-full"
      )}
    >
      <h1>Logo</h1>
      <div className="mt-3 w-full bg-white flex items-center space-x-3 max-w-lg shadow-[0_8px_24px_rgba(149,157,165,0.2)] py-3 px-2 rounded-lg">
        <Search />
        <input
          type="text"
          placeholder="Cari makanan atau tempat makan"
          className="w-full outline-none"
        />
      </div>

      <ul className="hidden md:flex gap-x-5">
        {!!user.id ? (
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-x-3">
                <SkeletonImage
                  src={imageFromBackend(
                    user.image ?? "public/img/user/default.png"
                  )}
                  alt={user.name}
                  height={100}
                  className="rounded-full w-10 h-10"
                  width={100}
                />
                <span className="text-[16px]">{user.name}</span>
                <ChevronDown />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href={`/users/${user.id}`}>Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Ulasan</DropdownMenuItem>
                <DropdownMenuItem>Pesan</DropdownMenuItem>
                <DropdownMenuItem>Koneksi Saya</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
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
