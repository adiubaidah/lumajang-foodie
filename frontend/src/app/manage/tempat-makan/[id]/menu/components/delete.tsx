import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { axiosInstance } from "~/lib/utils";
import { ModalProps} from "~/types";
import { DataModal } from "../page";
function Delete({
  body,
  isOpen,
  setIsOpen,
  placeId,
}: ModalProps<DataModal> & { placeId: string }) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationKey: ["delete-menu"],
    mutationFn: async (menuId: string) => {
      return (await axiosInstance.delete("/menu/" + menuId)).data;
    },
    onSuccess: () => {
      toast.success(`Menu berhasil dihapus`);
      queryClient.invalidateQueries({
        queryKey: ["menu", { place: placeId }],
      });
    },
    onSettled: () => {
      setIsOpen(false);
    },
    onError: () => {
      toast.error(`Menu gagal dihapus`);
    },
  });

  const handleDelete = () => {
    if (body.data) {
      deleteMutation.mutate(body.data.id as string);
    }
  };

  return (
    <AlertDialog
      open={isOpen && body.operation === "delete"}
      onOpenChange={setIsOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Hapus Menu &quot; {body?.data?.name} &quot;
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
            }}
            className="rounded-xl"
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex items-center rounded-xl"
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            {deleteMutation.isPending && (
              <Loader2 className="mr-2 animate-spin" />
            )}
            <span>Hapus</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Delete;
