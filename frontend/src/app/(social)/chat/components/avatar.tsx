"use client";
import { useState, useEffect } from "react";
import { User } from "~/types";
import Image from "next/image";

import { imageFromBackend } from "~/lib/utils";
import { useSocket } from "~/hooks";
import { useActiveUser } from "~/hooks";

interface AvatarProps {
  user?: User;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const isActive = useActiveUser(user as User);

  return (
    <div className="relative h-9 md:h-11">
      <div className="relative inline-block h-9 w-9 overflow-hidden rounded-full md:h-11 md:w-11">
        <Image
          className="object-cover"
          fill
          src={
            user?.image ? imageFromBackend(user.image) : "/assets/avatar.png"
          }
          alt="Avatar"
        />
      </div>
      {isActive && (
        <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white md:h-3 md:w-3" />
      )}
    </div>
  );
};

export default Avatar;
