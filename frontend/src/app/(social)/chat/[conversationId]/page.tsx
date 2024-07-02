import { cookies } from "next/headers";
import Body from "./components/body";
import EmptyState from "../../components/empty-state";
import Header from "./components/header";
import Form from "./components/form";
import { QueryClient } from "@tanstack/react-query";
interface PageProps {
  conversationId: string;
}

const getConversationById = async (conversationId: string, token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/conversation/${conversationId}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  );
  const result = await response.json();
  return result;
};

async function Page({ params }: { params: PageProps }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 5 * 60,
      },
    },
  });
  const access_token = cookies().get("access_token");
  if (!access_token) return null;
  const conversation = await getConversationById(
    params.conversationId,
    access_token?.value as string,
  );

  await queryClient.prefetchQuery({
    queryKey: ["messages", params.conversationId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/message?conversation=${conversation.id}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            Authorization: access_token.value,
          },
        },
      );
      const result = await response.json();
      return result;
    },
  });

  if (!conversation) {
    return (
      <div className="h-full lg:pl-80">
        <div className="flex h-full flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full lg:pl-80">
      <div className="flex h-full flex-col">
        <Header conversation={conversation} />
        <Body />
        <Form />
      </div>
    </div>
  );
}

export default Page;
