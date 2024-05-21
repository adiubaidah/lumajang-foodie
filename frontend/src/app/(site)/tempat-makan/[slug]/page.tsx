import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Client from "./client";

export default async function DetailTempatMakan({
  params,
}: {
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
        }
      );
      const result = await response.json();
      return result;
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["place-photo", { place: data.id }, "preview"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/place-photo?place=${data.result.id}&perPage=4`
      );
      const result = await response.json();
      return result;
    },
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Client />
    </HydrationBoundary>
  );
}
