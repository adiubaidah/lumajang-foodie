"use client";
import { useEffect, useState, createContext, useContext } from "react";
import io, { Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { useAuth } from "~/hooks";
import { ConversationUpdate } from "~/app/(chat)/chat/components/conversation-update";
import { usePathname } from "next/navigation";

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
      socket.off("connect", () => setIsConnected(false));
    };
  }, []);

  useEffect(() => {
    socket.emit("register", { userId: user && user.id });
    socket.on("registered", () => {
      console.log("registered");
    });

    // if (path !== "/chat") {
    //   socket.on("conversation:update", (data) => {
    //     toast.custom((t) => (
    //       <ConversationUpdate
    //         callback={() => toast.dismiss(t.id)}
    //         isVisible={t.visible}
    //         message={data.messages[data.messages.length - 1]}
    //         user={data.messages.seen[0]}
    //       />
    //     ));
    //   });
    // }

    return () => {
      socket.off("registered");
      // if (path !== "/chat") {
      //   socket.off("conversation:update");
      // }
      // socket.emit("unregister", { userId: user && user.id });
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
