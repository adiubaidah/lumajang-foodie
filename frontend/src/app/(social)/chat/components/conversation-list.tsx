"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import find from "lodash/find";
import ConversationBox from "./conversation-box";
import { useAuth, useConversation, useSocket } from "~/hooks";

import { FullConversationType, User } from "~/types";
// type Props = {
//   initialItems: FullConversationType[];
// };

import React from "react";
import { axiosInstance, cn } from "~/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { set } from "lodash";

function ConversationList() {
  const router = useRouter();
  const [items, setItems] = useState<FullConversationType[]>([]);
  const { socket } = useSocket();

  const { conversationId, isOpen } = useConversation();

  const { isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = (await axiosInstance.get("/conversation")).data;
      setItems(response);
      return response;
    },
    refetchOnMount: "always",
  });

  useEffect(() => {
    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (
          find(current, function (o) {
            return o.id === conversation.id;
          })
        ) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }

          return currentConversation;
        }),
      );
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((con) => con.id !== conversation.id)];
      });

      if (conversationId === conversation.id) {
        router.push("/chat");
      }
    };

    socket.on("conversation:new", newHandler);
    socket.on("conversation:update", updateHandler);
    socket.on("conversation:remove", removeHandler);
    return () => {
      socket.off("conversation:new", newHandler);
      socket.off("conversation:update", updateHandler);
      socket.off("conversation:remove", removeHandler);
    };
  }, [socket, router, conversationId]);
  return (
    <aside
      className={cn(
        `fixed inset-y-0 overflow-y-auto border-r border-gray-200 bg-white pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0`,
        isOpen ? "hidden" : "left-0 block w-full",
      )}
    >
      <div className="px-5">
        <div className="mb-4 flex justify-between pt-4">
          <div className="text-2xl font-bold text-neutral-800">Pesan</div>
        </div>
        {items.map((item) => (
          <ConversationBox
            key={item.id}
            data={item}
            selected={conversationId === item.id}
          />
        ))}
      </div>
    </aside>
  );
}

export default ConversationList;
