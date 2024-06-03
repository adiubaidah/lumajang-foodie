import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, SquarePlus } from "lucide-react";
import { cn } from "~/lib/utils";
import { axiosInstance } from "~/lib/utils";
import toast from "react-hot-toast";
import { useAuth } from "~/hooks";

interface ArchiveButtonProps {
  place: string;
}

function ArchiveButton({ place }: ArchiveButtonProps) {
  const { user: userAuth } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["check-archive", { auth: userAuth && userAuth.id, place }],
    queryFn: async () => {
      return (await axiosInstance.get(`/place-archive?place=${place}`)).data;
    },
    enabled: !!userAuth && !!userAuth.id && !!place,
  });

  const archiveMutation = useMutation({
    mutationFn: async ({ archive }: { archive: boolean }) => {
      if (archive) {
        return (await axiosInstance.delete(`/place-archive?place=${place}`))
          .data;
      }
      return (await axiosInstance.post(`/place-archive/place=${place}`)).data;
    },
    onSuccess: (data) => {
      if (data.type === "archive") {
        toast.success("Berhasil mengarsipkan");
      } else {
        toast.success("Berhasil menghapus arsip");
      }
      queryClient.invalidateQueries({
        queryKey: ["check-archive", { auth: userAuth && userAuth.id, place }],
      });
    },
    onError: () => {
      toast.error("Gagal memfollow");
    },
  });

  const handleArchiveToggle = () => {
    archiveMutation.mutate({ archive: data });
  };

  return (
    <button
      className={cn(
        "group mx-auto mt-2 flex items-center gap-x-2 rounded-lg px-2 py-1 font-bold text-davy transition",
        data ? "bg-puce hover:bg-white" : "bg-white hover:bg-puce",
      )}
      onClick={handleArchiveToggle}
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

export default ArchiveButton;
