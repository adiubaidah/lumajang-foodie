"use client";

import { User } from "~/types";
import Image from "next/image";

import useActiveList from "~/hooks/useActiveList";
import { imageFromBackend } from "~/lib/utils";

interface AvatarProps {
  user?: User;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email!) !== -1;

  return (
    <div className="relative h-9 md:h-11">
      <div className="relative inline-block h-9 w-9 overflow-hidden rounded-full md:h-11 md:w-11">
        <Image
          className="object-cover"
          fill
          src={imageFromBackend(user?.image ?? "public/img/user/default.png")}
          alt="Avatar"
        />
      </div>
      {isActive && (
        <span className="dark:ring-lightgray absolute right-0 top-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white md:h-3 md:w-3" />
      )}
    </div>
  );
};

export default Avatar;
