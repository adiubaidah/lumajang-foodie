"use client";
import { useEffect, useState, createContext, useContext } from "react";
import io, { Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { useAuth } from "~/hooks";
import { ConversationUpdate } from "~/app/(social)/chat/components/conversation-update";
import { usePathname } from "next/navigation";
import { axiosInstance } from "~/lib/utils";

export const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}/message`, {
  autoConnect: false,
  transports: ["websocket"],
});

type SocketProviderType = {
  socket: Socket;
  isConnected: boolean;
};

export const SocketContext = createContext<SocketProviderType>({
  socket: {} as Socket,
  isConnected: false,
});

const unregister = async () => {
  return (await axiosInstance.delete("/user/online")).data;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { user } = useAuth();
  const path = usePathname();

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setIsConnected(true);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    socket.emit("register", { userId: user && user.id });
    socket.on("registered", () => {
      console.log("registered");
    });

    return () => {
      socket.off("registered");
    };
  }, [user]);
  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => {
  return useContext(SocketContext);
};

export default useSocket;
