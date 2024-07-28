import Link from "next/link";
import Header from "./components/header";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import { cn } from "~/lib/utils";
import NavLinks from "./components/navlinks";

async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 5 * 60,
      },
    },
  });

  const dataUser = await queryClient.fetchQuery({
    queryKey: ["user", params && params.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/${params.id}`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const result = await response.json();
      return result;
    },
  });

  return (
    <div>
      <Header dataUser={dataUser} />
      <div className="mt-10 flex flex-col md:flex-row">
        <NavLinks />
        <div className="w-full px-2 md:px-8">
          <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
          </HydrationBoundary>
        </div>
      </div>
    </div>
  );
}

export default Layout;
