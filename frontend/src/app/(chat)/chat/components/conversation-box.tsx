import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn, formatTime } from "~/lib/utils";
import { useAuth, useOtherUser } from "~/hooks";
import { FullConversationType } from "~/types";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import Avatar from "./avatar";

type Props = {
  data: FullConversationType;
  selected?: boolean;
};

function ConversationBox({ data, selected }: Props) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const otherUser = useOtherUser(data);

  const handleClick = useCallback(() => {
    router.push(`/chat/${data.id}`);
  }, [data.id, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a Conversations";
  }, [lastMessage]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!currentUser || !currentUser.id) {
      return false;
    }

    return seenArray.filter((user) => user.id === currentUser.id).length !== 0;
  }, [currentUser, lastMessage]);

  return (
    <div
    onClick={handleClick}
    className={cn(
      `w-full relative flex items-center space-x-3 p-3 hover:bg-neutral-100 dark:bg-black dark:hover:bg-neutral-900 rounded-lg transition cursor-pointer`,
      selected
        ? "bg-neutral-100 dark:bg-neutral-900"
        : "bg-white dark:bg-black"
    )}
  >
    <Avatar user={otherUser} />
    <div className="min-w-0 flex-0">
      <div className="focus:outline-none">
        <div className="flex justify-between items-center mb-1">
          <p className="text-md text-gray-900 dark:text-gray-100 font-medium truncate">
            {otherUser.name}
          </p>
          {lastMessage?.createdAt && (
            <p className="text-xs text-gray-400 font-light dark:text-gray-300 pl-2">
              {formatTime(new Date(lastMessage.createdAt))}
            </p>
          )}
        </div>
        <p
          className={cn(
            `truncate text-sm`,
            hasSeen
              ? "text-gray-500 dark:text-gray-400"
              : "text-black dark:text-white font-medium"
          )}
        >
          {lastMessageText}
        </p>
      </div>
    </div>
  </div>
  );
}

export default ConversationBox;
