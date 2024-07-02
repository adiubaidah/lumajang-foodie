"use client";

import { useCallback, useState } from "react";

import { useRouter } from "next/navigation";
import { axiosInstance } from "~/lib/utils";
import { User } from "~/types";

import Avatar from "../../chat/components/avatar";

interface UserBoxProps {
  data: User;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);

    axiosInstance
      .post("/conversation", { receiverId: data.id })
      .then((data) => {
        router.push(`/chat/${data.data.id}`);
      })
      .finally(() => setIsLoading(false));
  }, [data, router]);

  return (
    <>
      <div
        onClick={handleClick}
        className="relative flex w-full cursor-pointer items-center space-x-3 rounded-lg p-3 transition hover:bg-neutral-100"
      >
        <Avatar user={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                {data.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
