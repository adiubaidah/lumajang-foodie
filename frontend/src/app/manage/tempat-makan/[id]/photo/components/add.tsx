import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "~/lib/utils";
import { placePhotoSchema } from "~/schema";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

import { ModalProps, NewPlacePhoto } from "~/types";
import { DataModal } from "../page";

function Add({
  body,
  isOpen,
  setIsOpen,
  placeId,
}: ModalProps<DataModal> & { placeId: string }) {
  const [image, setImage] = useState<File | null>();
  const queryClient = useQueryClient();
  const form = useForm<NewPlacePhoto>({
    resolver: zodResolver(placePhotoSchema),
    defaultValues: {
      type: "thumbnail",
      thumbnailPosition: undefined,
      placeId: "",
    },
  });

  useEffect(() => {
    if (placeId) {
      form.setValue("placeId", placeId);
    }
  }, [placeId, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      setImage(files[0]);
    }
  };

  const placePhotoMutation = useMutation({
    mutationKey: ["add-photo"],
    mutationFn: async (payload: FormData) => {
      return await axiosInstance
        .post("/place-photo/", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res.data);
    },
    onSuccess: () => {
      toast.success(`Foto berhasil ditambahkan`);
      queryClient.invalidateQueries({
        queryKey: ["place-photo", { place: placeId }],
      });
    },
    onSettled: () => {
      setIsOpen(false);
      form.reset({ placeId });
      setImage(null);
    },
    onError: () => {
      toast.error("Foto gagal ditambahkan");
    },
  });

  function onSubmit(values: NewPlacePhoto) {
    const formData = new FormData();
    formData.append("placeId", values.placeId);
    formData.append("type", values.type);
    if(values.thumbnailPosition) {
      formData.append("thumbnailPosition", values.thumbnailPosition.toString());
    }
    if (image instanceof File) {
      formData.append("photo", image);
    }
    placePhotoMutation.mutate(formData);
  }

  return (
    <Dialog open={isOpen && body.operation === "add"} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[650px] pt-8">
        <DialogHeader>
          <DialogTitle>Tambah Foto</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-8"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Foto</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue="thumbnail"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipe Gambar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="gallery">Galeri</SelectItem>
                      <SelectItem value="menu">Menu</SelectItem>
                      <SelectItem value="thumbnail">Thumbnail</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnailPosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posisi Gambar</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="posisi"
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(Number(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              {image ? (
                <Image
                  src={image ? URL.createObjectURL(image) : ""}
                  width={180}
                  height={180}
                  className="w-[180px]"
                  alt="Image"
                />
              ) : (
                <div className="h-56 w-56 bg-gray-400"></div>
              )}

              <Input
                type="file"
                name="gambar"
                placeholder="pilih gambar"
                onChange={handleImageChange}
                disabled={placePhotoMutation.isPending}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={placePhotoMutation.isPending}>
                {placePhotoMutation.isPending ? (
                  <div className="flex gap-x-4">
                    <Loader2 className="animate-spin" />
                    Menyimpan
                  </div>
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default Add;
