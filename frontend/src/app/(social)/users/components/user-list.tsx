"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "~/components/ready-use/loader";
import { axiosInstance, createQueryString } from "~/lib/utils";
import UserBox from "./user-box";
import { User } from "~/types";
import { Input } from "~/components/ui/input";
import { useDebouncedCallback } from "use-debounce";

const UserList = () => {
  const [query, setQuery] = useState<string>("");
  const { data, isLoading } = useQuery({
    queryKey: ["users", { q: query }],
    queryFn: async () => {
      const qr = createQueryString({ q: query });
      return (await axiosInstance.get(`/user?${qr}`)).data;
    },
  });

  const handleQuery = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    400,
  );

  return (
    <aside className="dark:border-lightgray fixed inset-y-0 left-0 block w-full overflow-y-auto border-r border-gray-200 pb-20 lg:left-20 lg:block lg:w-80 lg:pb-0">
      <div className="px-5">
        <div className="flex-col">
          <div className="py-4 text-2xl font-bold text-neutral-800 dark:text-gray-200">
            Foodie
          </div>
        </div>
        <Input
          className="mb-2 w-full rounded-full px-4 py-2 font-light text-black focus:outline-none"
          placeholder="Cari foodie"
          onChange={handleQuery}
        />
        {isLoading || !data ? (
          <div className="mt-28 grid h-12 w-full place-content-center">
            <Loader />
          </div>
        ) : data.length > 0 ? (
          data?.map((item: User) => <UserBox key={item.id} data={item} />)
        ) : (
          "Data not found"
        )}
      </div>
    </aside>
  );
};

export default UserList;
