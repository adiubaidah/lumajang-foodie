import React from "react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import Edit from "./edit";
import Password from "./password";
import { Lock, Pencil } from "lucide-react";
function Page({ params }: { params: { catch: string[] } }) {
  return (
    <div className="md:h-screen md:flex md:items-center px-4 md:px-0">
      <ul className="my-3 flex w-full md:w-1/5 md:h-full flex-row items-center justify-between md:bg-white pt-11 md:my-0 md:flex-col md:justify-normal md:gap-y-4 md:px-10">
        <li
          className={cn(
            !params.catch || params.catch[0] === "edit"
              ? "font-bold text-black"
              : "text-davy",
            "flex items-center gap-x-3",
          )}
        >
          <Pencil size={28} />
          <Link href="/manage/profile/edit" className="text-base">
            Edit Profil
          </Link>
        </li>
        <li
          className={cn(
            params.catch && params.catch[0] === "password"
              ? "font-bold text-black"
              : "text-davy",
            "flex items-center gap-x-3",
          )}
        >
          <Lock size={28} />
          <Link href="/manage/profile/password" className="text-base">
            Password
          </Link>
        </li>
      </ul>
      <div className="h-full w-full md:w-4/5 md:p-7 overflow-y-auto">
        {params.catch && params.catch[0] === "password" ? (
          <Password />
        ) : (
          <Edit />
        )}
      </div>
    </div>
  );
}

export default Page;
