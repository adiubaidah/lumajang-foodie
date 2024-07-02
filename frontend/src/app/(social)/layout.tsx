"use client";
import { SocketProvider } from "~/hooks/useSocket";
import { User } from "~/types";
import DesktopSidebar from "./components/desktop-sidebar";
import MobileFooter from "./components/mobile-footer";
import { useAuth } from "~/hooks";

function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <SocketProvider>
      <div className="h-screen">
        <DesktopSidebar currentUser={user! as User} />
        <MobileFooter currentUser={user! as User} />
        <main className="h-full lg:pl-20">{children}</main>
      </div>
    </SocketProvider>
  );
}

export default Layout;
