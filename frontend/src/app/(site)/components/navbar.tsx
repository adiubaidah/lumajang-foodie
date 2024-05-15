"use client";
import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
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
import { cn } from "~/lib/utils";
import { useScrollPosition } from "~/hooks";
import { Button } from "~/components/ui/button";

function Navbar() {
  const yAxis = useScrollPosition();
  return (
    <header>
      <div
        className={cn(
          "absolute container max-w-full bg-red-200 flex flex-col md:flex-row items-center justify-between uppercase font-semibold pt-5 pb-3 ",
          yAxis > 80 &&
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
          <li>
            <Link href="favorit">
              <User className="text-gray" size={22} />
            </Link>
          </li>
          <li>
            <Link href="favorit">
              <User className="text-gray" size={22} />
            </Link>
          </li>
          <li className="relative">
            <Link href="favorit">
              <Heart className="text-gray" size={22} />
            </Link>
            <span className="absolute rounded-full bg-primary w-5 h-5 block leading-5 text-[12px] text-center -bottom-3 -right-3 text-white">
              6
            </span>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Navbar;
