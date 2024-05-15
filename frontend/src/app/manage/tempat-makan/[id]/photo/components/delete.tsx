import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "~/lib/utils";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { ModalProps, PlacePhoto } from "~/types";
import { Loader2 } from "lucide-react";
import { DataModal } from "../page";
function Delete({
  body,
  isOpen,
  setIsOpen,
  placeId,
}: ModalProps<DataModal> & { placeId: string }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationKey: ["delete-photo"],
    mutationFn: async (placePhotoId: string) => {
      const res = await axiosInstance.delete("/place-photo/" + placePhotoId);
      return res.data;
    },
    onSuccess: () => {
      toast.success(`Foto berhasil dihapus`);
      queryClient.invalidateQueries({
        queryKey: ["place-photo", { place: placeId }],
      });
    },
    onSettled: () => {
      setIsOpen(false);
    },
    onError: () => {
      toast.error(`Foto gagal dihapus`);
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
          <AlertDialogTitle>Hapus Foto</AlertDialogTitle>
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
            className="rounded-xl flex items-center"
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            {deleteMutation.isPending && (
              <Loader2 className="animate-spin mr-2" />
            )}
            <span>Hapus</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Delete;
