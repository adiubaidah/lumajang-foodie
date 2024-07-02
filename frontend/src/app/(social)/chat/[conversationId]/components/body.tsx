"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import find from "lodash/find";

import { useSocket, useConversation, useAuth } from "~/hooks";

import { FullMessageType } from "~/types";
import MessageBox from "./message-box";
import { axiosInstance } from "~/lib/utils";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body = () => {
  const { user: currentUser } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();
  const [messages, setMessages] = useState<FullMessageType[]>([]);

  const { conversationId } = useConversation();

  const { isLoading } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const response = (
        await axiosInstance.get(`/message?conversation=${conversationId}`)
      ).data;
      setMessages(response);
      return response;
    },
    enabled: !!conversationId,
    refetchOnMount: "always",
  });

  useEffect(() => {
    axiosInstance.post(`/conversation/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.emit("conversation:join", {
      conversationId,
      userId: currentUser && currentUser.id,
    });
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axiosInstance.post(`/conversation/${conversationId}/seen`);
      console.log(message);
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        }),
      );
    };

    socket.on("message:new", messageHandler);
    socket.on("message:update", updateMessageHandler);

    return () => {
      socket.emit("conversation:leave", {
        conversationId,
        userId: currentUser && currentUser.id,
      });
      socket.off("message:new", messageHandler);
      socket.off("message:update", updateMessageHandler);
    };
  }, [conversationId, socket]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div className="pt-1" ref={bottomRef} />
    </div>
  );
};

export default Body;
