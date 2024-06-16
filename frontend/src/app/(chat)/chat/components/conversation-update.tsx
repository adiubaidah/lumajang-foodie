import React from "react";
import Image from "next/image";
import { cn, cutString, imageFromBackend } from "~/lib/utils";
import { User } from "~/types";
export function ConversationUpdate({
  isVisible,
  callback,
  user,
  message,
}: {
  isVisible: boolean;
  user: User;
  message: string;
  callback: () => void;
}) {
  return (
    <div
      className={cn(
        isVisible ? "animate-enter" : "animate-leave",
        "pointer-events-auto flex w-full max-w-md rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5",
      )}
    >
      <div className="w-0 flex-1 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <Image
              className="h-10 w-10 rounded-full"
              src={imageFromBackend(user.image ?? 'public/img/user/default.png')}
              width={40}
              height={40}
              alt=""
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="mt-1 text-sm text-gray-500">
              {cutString(message, 10)}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={callback}
          className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}
