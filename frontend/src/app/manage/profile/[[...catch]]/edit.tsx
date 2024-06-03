"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Camera, Loader2 } from "lucide-react";
import { useAuth } from "~/hooks";
import { axiosInstance, imageFromBackend } from "~/lib/utils";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormDescription,
  FormMessage,
  FormLabel,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { editSchema, EditType } from "~/app/(site)/my-profile/components/edit";
import { Textarea } from "~/components/ui/textarea";
import { SubdistrictComboBox } from "~/components/ready-use/subdistrict-combobox";
import { Input } from "~/components/ui/input";
import { UserComplete } from "~/types";
function Edit() {
  const form = useForm<EditType>({
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
  const { user } = useAuth();
  const { data: dataUser } = useQuery<UserComplete>({
    queryKey: ["user", { user: user && user.id }],
    queryFn: async () => {
      return (await axiosInstance.get(`/user/${user.id}`)).data;
    },
    staleTime: Infinity,
  });
  const [image, setImage] = useState<File | string>();
  const [backgroundImage, setBackgroundImage] = useState<File | string>();
  const [subdistrict, setSubdistrict] = useState("");
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      setImage(files[0]);
    }
  };

  useEffect(() => {
    if (dataUser) {
      form.setValue("email", dataUser.email);
      form.setValue("gender", dataUser.gender ?? undefined);
      form.setValue("name", dataUser.name);
      form.setValue("isPrivate", dataUser.isPrivate);
      form.setValue("description", dataUser.description ?? undefined);
      form.setValue("subdistrictId", dataUser.subdistrictId ?? undefined);
      if (dataUser.subdistrict) {
        setSubdistrict(dataUser.subdistrict.id);
      }
      if (dataUser.image) {
        setImage(dataUser.image);
      }
      if (dataUser.backgroundImage) {
        setBackgroundImage(dataUser.backgroundImage);
      }
    }
  }, [dataUser, form]);

  const handleBackgroundImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
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

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => console.log(values))}
          className="space-y-3"
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
                <Select onValueChange={field.onChange} value={field.value}>
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
              <div className="h-56 w-56 bg-gray-400"></div>
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
              className="absolute left-1/2 top-1/2 -translate-x-1/2"
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
                className="h-56 w-full object-cover"
                alt="Image"
              />
            ) : (
              <div className="h-56 w-full bg-gray-400"></div>
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
              className="absolute left-1/2 top-1/2 -translate-x-1/2"
            >
              <Camera />
            </label>
          </div>
          <Button
            type="submit"
            className="h-[45.6px] rounded-md px-[35px] font-bold shadow-[0_8px_12px_rgba(249,116,0,0.3)]"
            disabled={userMutation.isPending}
          >
            {userMutation.isPending ? (
              <Loader2 className="mx-auto animate-spin" />
            ) : (
              <span>Update</span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default Edit;
