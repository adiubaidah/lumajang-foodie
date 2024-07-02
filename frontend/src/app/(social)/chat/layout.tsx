const revalidate = 0;
import React from "react";
import { cookies } from "next/headers";
import ConversationList from "./components/conversation-list";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Conversation, FullConversationType } from "~/types";

async function Layout({ children }: { children: React.ReactNode }) {
  const accessToken = cookies().get("access_token");
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 5 * 60,
      },
    },
  });
  if (!accessToken) return null;

  await queryClient.prefetchQuery<FullConversationType[]>({
    queryKey: ["conversation"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/conversation`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Authorization: accessToken.value,
          },
        },
      );
      const result = await response.json();
      return result;
    },
  });
  return (
    <div className="h-full">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ConversationList />
        <main className="h-full">{children}</main>
      </HydrationBoundary>
    </div>
  );
}

export default Layout;
