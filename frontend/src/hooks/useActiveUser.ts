import React, { useEffect, useState } from "react";
import useSocket from "./useSocket";
import { User } from "~/types";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/utils";
import { set } from "lodash";

export default function useActiveUser(user: User) {
  const { socket } = useSocket();
  const [isActive, setIsActive] = useState(false);

  const handleStatusChange = (data: { userId: string; online: boolean }) => {
    setIsActive(data.online);
  };

  useQuery({
    queryKey: ["check-online", { user: user && user.id }],
    queryFn: async () => {
      const response = (
        await axiosInstance.get("/user/online", { params: { id: user.id } })
      ).data;
      setIsActive(response.online);
      return response.online;
    },
    enabled: !!user && !!user.id,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!user) return;
    if (!socket) return;
    const statusEvent = `user-${user.id}:status`;
    socket.on(statusEvent, handleStatusChange);

    return () => {
      socket.off(statusEvent, handleStatusChange);
    };
  }, [user, socket]);

  return isActive;
}
