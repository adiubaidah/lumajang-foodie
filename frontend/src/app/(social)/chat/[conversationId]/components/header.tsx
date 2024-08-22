"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, MessageCircleMore } from "lucide-react";

import useOtherUser from "~/hooks/useOtherUser";
import { Conversation, User } from "~/types";

import Avatar from "../../components/avatar";
import useActiveList from "~/hooks/useActiveList";
import ChatDrawer from "./chat-drawer";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.id!) !== -1;
  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return isActive ? "Active" : "Offline";
  }, [conversation.isGroup, conversation.users.length, isActive]);

  return (
    <>
      <ChatDrawer
        data={conversation}
        isOpen={drawerOpen}
        setIsOpen={setDrawerOpen}
      />
      <div className="flex w-full items-center justify-between border-b-[1px] bg-white px-4 py-3 shadow-sm sm:px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="block cursor-pointer text-puce transition hover:text-puce/95 lg:hidden"
          >
            <ChevronLeft size={32} />
          </Link>

          <Avatar user={otherUser} />

          <div className="flex flex-col">
            <div>{otherUser.name}</div>
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>
        <MessageCircleMore
          size={32}
          onClick={() => setDrawerOpen(true)}
          className="cursor-pointer text-sky-500 transition hover:text-sky-600"
        />
      </div>
    </>
  );
};

export default Header;
