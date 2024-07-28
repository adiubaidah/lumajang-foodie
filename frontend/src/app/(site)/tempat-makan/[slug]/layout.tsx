import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Header from "./header";
import { Metadata } from "next";
import { imageFromBackend } from "~/lib/utils";

type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/place/find/?slug=${params.slug}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );
  const result = await response.json();

  return {
    title: result.name,
    description: result.description,
  };
}

async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 5 * 60,
      },
    },
  });
  const data = await queryClient.fetchQuery({
    queryKey: ["place", params.slug],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/place/find/?slug=${params.slug}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );
      const result = await response.json();
      return result;
    },
  });

  const previewPhoto = await queryClient.fetchQuery({
    queryKey: ["place-photo", { place: data.id }, "preview"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/place-photo?place=${data.id}&perPage=4&preview=1`,
      );
      const result = await response.json();
      return result;
    },
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Header detail={data} imagePreview={previewPhoto} />
      <main className="mt-4 py-3">{children}</main>
    </HydrationBoundary>
  );
}

export default Layout;
