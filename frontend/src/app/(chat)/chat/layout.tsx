import React from "react";
import { cookies } from "next/headers";
import { QueryClient } from "@tanstack/react-query";
import ConversationList from "./components/conversation-list";

async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen">
      <ConversationList />
      <main className="lg:pl-20 h-full">{children}</main>
    </div>
  );
}

export default Layout;
