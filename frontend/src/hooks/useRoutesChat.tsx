"use client"
import { useMemo } from "react";
import { MessageCircleMore, UsersRound } from "lucide-react";

import { usePathname } from "next/navigation";

import useConversation from "./useConversation";

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversation();

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: "/chat",
        icon: MessageCircleMore,
        active: pathname === "/chat" || !!conversationId,
      },
      {
        label: "Users",
        href: "/users",
        icon: UsersRound,
        active: pathname === "/users",
      },
    ],
    [pathname, conversationId],
  );

  return routes;
};

export default useRoutes;
