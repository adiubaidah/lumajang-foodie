import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import Sidebar from "../layout";
import UserList from "./components/user-list";
import { User } from "~/types";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = cookies().get("access_token");
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 5 * 60,
      },
    },
  });
  if (!accessToken) return null;
  await queryClient.prefetchQuery<User[]>({
    queryKey: ["users", { q: "" }],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user`,
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
        <UserList />
        {children}
      </HydrationBoundary>
    </div>
  );
}
