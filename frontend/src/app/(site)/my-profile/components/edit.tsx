import { useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Loader2, Camera } from "lucide-react";
import { z } from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { SubdistrictComboBox } from "~/components/ready-use/subdistrict-combobox";
import { Input } from "~/components/ui/input";
import { userSchema } from "~/schema";
import { axiosInstance, imageFromBackend } from "~/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import React, { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import toast from "react-hot-toast";
import { ScrollArea } from "~/components/ui/scroll-area";
import { User } from "~/types";

const editSchema = userSchema.pick({
  description: true,
  email: true,
  gender: true,
  isPrivate: true,
  name: true,
  subdistrictId: true,
});

type Edit = z.infer<typeof editSchema>;
interface EditProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value?: User;
}

function Edit({ isOpen, setIsOpen, value }: EditProps) {
  const [image, setImage] = useState<File | string | null>();
  const [backgroundImage, setBackgroundImage] = useState<
    File | string | null
  >();
  const form = useForm<Edit>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      description: undefined,
      email: "",
      gender: undefined,
      isPrivate: false,
      name: "",
      subdistrictId: undefined,
    },
  });

  const [subdistrict, setSubdistrict] = useState("");

  useEffect(() => {
    if (value) {
      form.setValue("email", value.email);
      form.setValue("gender", value.gender ?? undefined);
      form.setValue("name", value.name);
      form.setValue("isPrivate", value.isPrivate);
      form.setValue("description", value.description ?? undefined);
      form.setValue("subdistrictId", value.subdistrictId ?? undefined);
      if (value.subdistrictId) {
        setSubdistrict(value.subdistrictId);
      }
      if (value.image) {
        setImage(value.image);
      }
      if (value.backgroundImage) {
        setBackgroundImage(value.backgroundImage);
      }
    }
  }, [value, form]);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      setImage(files[0]);
    }
  };

  const handleBackgroundImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { files } = e.target;
    if (files) {
      setBackgroundImage(files[0]);
    }
  };

  const userMutation = useMutation({
    mutationFn: async (payload: FormData) => {
      return axiosInstance
        .put("/user/update-profile", payload)
        .then((data) => data.data);
    },
    onSuccess: () => {
      toast.success("Profile berhasil diupdate");
      window.location.reload();
    },
    onError: () => {
      toast.error("Profil gagal diupdate");
    },
  });

  const onSubmit = (values: Edit) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      formData.append(key, value.toString());
    }
    if (image instanceof File) {
      formData.append("image", image);
    }
    if (backgroundImage instanceof File) {
      formData.append("backgroundImage", backgroundImage);
    }
    userMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profil</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <ScrollArea className="h-[500px] overflow-y-auto">
            <form
              className="space-y-3 px-3"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={userMutation.isPending} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        disabled={userMutation.isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="gender"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="L">Laki - laki</SelectItem>
                        <SelectItem value="P">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                name="isPrivate"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-x-3">
                      <FormLabel>Privasi</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={userMutation.isPending}
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Jika akun diprivasi, maka pengguna lain tidak bisa melihat
                      profile anda
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi singkat</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={userMutation.isPending} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="subdistrictId"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Kecamatan</FormLabel>
                    <FormControl>
                      <SubdistrictComboBox
                        value={subdistrict}
                        setValue={setSubdistrict}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="relative w-fit">
                {image ? (
                  <Image
                    src={
                      image instanceof File
                        ? URL.createObjectURL(image)
                        : typeof image === "string"
                        ? imageFromBackend(image)
                        : ""
                    }
                    width={180}
                    height={180}
                    className="w-[180px]"
                    alt="Image"
                  />
                ) : (
                  <div className="bg-gray-400 w-56 h-56"></div>
                )}

                <Input
                  type="file"
                  id="image"
                  className="hidden"
                  placeholder="pilih gambar"
                  onChange={handleImageChange}
                  disabled={userMutation.isPending}
                />
                <label
                  htmlFor="image"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2"
                >
                  <Camera />
                </label>
              </div>
              <div className="relative w-full">
                {backgroundImage ? (
                  <Image
                    src={
                      backgroundImage instanceof File
                        ? URL.createObjectURL(backgroundImage)
                        : typeof backgroundImage === "string"
                        ? imageFromBackend(backgroundImage)
                        : ""
                    }
                    width={400}
                    height={400}
                    className="w-full h-56 object-cover"
                    alt="Image"
                  />
                ) : (
                  <div className="bg-gray-400 w-full h-56"></div>
                )}

                <Input
                  type="file"
                  id="backgroundImage"
                  className="hidden"
                  placeholder="pilih gambar"
                  onChange={handleBackgroundImageChange}
                  disabled={userMutation.isPending}
                />
                <label
                  htmlFor="backgroundImage"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2"
                >
                  <Camera />
                </label>
              </div>
              <Button
                type="submit"
                className="font-bold rounded-md w-full px-[35px] h-[45.6px] shadow-[0_8px_12px_rgba(249,116,0,0.3)]"
                disabled={userMutation.isPending}
              >
                {userMutation.isPending ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  <span>Update</span>
                )}
              </Button>
            </form>
          </ScrollArea>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default Edit;
