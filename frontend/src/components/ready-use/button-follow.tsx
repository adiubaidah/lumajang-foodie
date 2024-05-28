import React from "react";
import { Check, SquarePlus } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { cn } from "~/lib/utils";
import { axiosInstance } from "~/lib/utils";
import toast from "react-hot-toast";

interface ButtonFollowProps {
  user: string;
}

export function ButtonFollow({ user }: ButtonFollowProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["check-follow", user],
    queryFn: async () => {
      return (await axiosInstance.get(`/user-follow/check-follow?user=${user}`))
        .data;
    },
    enabled: !!user,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      return (await axiosInstance.post(`/user-follow/${user}`)).data;
    },
    onSuccess: () => {
      toast.success("Berhasil memfollow");
    },
    onError: () => {
      toast.error("Gagal memfollow");
    },
  });

  const handleToggle = () => {};

  return (
    <button
      className={cn(
        "font-bold mx-auto px-2 py-1 rounded-lg text-davy flex items-center gap-x-2 mt-2 group  transition",
        data
          ? "bg-puce hover:bg-white"
          : "bg-white hover:bg-puce"
      )}
    >
      {data ? (
        <React.Fragment>
          <Check className="text-white group-hover:text-puce" />
          <span className="text-white group-hover:text-davy">Mengikuti</span>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <SquarePlus className="text-puce group-hover:text-white" />
          <span className="text-davy group-hover:text-white">Ikuti</span>
        </React.Fragment>
      )}
    </button>
  );
}
