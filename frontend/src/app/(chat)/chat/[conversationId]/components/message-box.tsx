"use client";

import { useState } from "react";
import clsx from "clsx";

import Image from "next/image";

import Avatar from "../../components/avatar";
import { FullMessageType } from "~/types";
import { useAuth } from "~/hooks";
import { formatTime, cn } from "~/lib/utils";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const { user: currentUser } = useAuth();

  const isOwn = currentUser?.id === data?.sender?.id;
  const seenList = (data.seen || [])
    .filter((user) => user.id !== data?.sender?.id)
    .map((user) => user.name)
    .join(", ");

  const container = cn("flex gap-3 p-4", isOwn && "justify-end");
  const avatar = cn(isOwn && "order-2");
  const body = cn("flex flex-col gap-2", isOwn && "items-end");
  const message = cn(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-puce text-white" : "bg-gray",
    "rounded-full py-2 px-3",
  );

  return (
    <div className={container}>
      {!isOwn && (
        <div className={avatar}>
          <Avatar user={data.sender} />
        </div>
      )}
      <div className={body}>
        <div className="flex items-center gap-1">
          {!isOwn && (
            <div className="text-sm text-gray-500">{data.sender.name}</div>
          )}
          <div className="text-xs text-gray-400">
            {formatTime(new Date(data.createdAt))}
          </div>
        </div>
        <div className={message}>{data.body}</div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
