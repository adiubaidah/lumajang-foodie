import { cookies } from "next/headers";
import Body from "./components/body";
import EmptyState from "../components/empty-state";
import Header from "./components/header";
import Form from "./components/form";
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

const getMessagesByConversation = async (
  conversationId: string,
  token: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/message?conversation=${conversationId}`,
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
  const access_token = cookies().get("access_token");
  const conversation = await getConversationById(
    params.conversationId,
    access_token?.value as string,
  );
  const messages = await getMessagesByConversation(
    conversation.id,
    access_token?.value as string,
  );

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
        <Body initialMessages={messages} />
        <Form />
      </div>
    </div>
  );
}

export default Page;
