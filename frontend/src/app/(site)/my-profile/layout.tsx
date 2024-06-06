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

async function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 5 * 60,
      },
    },
  });
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token");

  const data = await queryClient.fetchQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/is-auth`,
        {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: accessToken }),
        },
      );
      const result = await response.json();
      return result;
    },
  });

  const dataUser = await queryClient.fetchQuery({
    queryKey: ["user", data && data.id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/${data.id}`,
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
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Layout;
