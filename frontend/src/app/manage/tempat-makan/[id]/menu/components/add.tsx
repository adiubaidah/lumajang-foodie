import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance, rupiah } from "~/lib/utils";

import { ModalProps, NewMenu } from "~/types";
import { DataModal } from "../page";
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
import { menuSchema } from "~/schema";
import toast from "react-hot-toast";
import { ScrollArea } from "~/components/ui/scroll-area";
function Add({
  body,
  isOpen,
  setIsOpen,
  placeId,
}: ModalProps<DataModal> & { placeId: string }) {
  const [image, setImage] = useState<File | null>();
  const queryClient = useQueryClient();
  const form = useForm<NewMenu>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: "",
      type: "food",
      placeId: "",
      price: 0,
    },
  });
  useEffect(() => {
    if (placeId) {
      form.setValue("placeId", placeId);
    }
  }, [placeId, form]);

  const menuMutation = useMutation({
    mutationFn: async (payload: FormData) => {
      return (await axiosInstance.post("/menu", payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })).data;
    },
    onSuccess: () => {
      toast.success("Menu berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["menu"] });
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      setImage(files[0]);
    }
  };

  function onSubmit(values: NewMenu) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    if (image instanceof File) {
      formData.append("photo", image);
    }
    menuMutation.mutate(formData);
  }
  return (
    <Dialog open={isOpen && body.operation === "add"} onOpenChange={setIsOpen}>
      <DialogContent className="pt-8">
        <DialogHeader>
          <DialogTitle>Tambah Menu</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[500px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-4 space-y-4 px-5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ayam Geprek" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe Menu</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue="food">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Makanan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="food">Makanan</SelectItem>
                        <SelectItem value="drink">Minuman</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="10000"
                        onChange={(e) => {
                          const value = e.target.value.replace(/Rp|\s|\./g, "");
                          if (!value || !isNaN(Number(value))) {
                            field.onChange(Number(value));
                          }
                        }}
                        value={field.value ? rupiah(field.value) : ""}
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
                  disabled={menuMutation.isPending}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={menuMutation.isPending}>
                  {menuMutation.isPending ? (
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default Add;
