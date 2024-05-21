"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Switch } from "~/components/ui/switch";
import { axiosInstance } from "~/lib/utils";
import { placeSchema } from "~/schema";
import { days } from "~/constant";
import { Location as LocationType, NewPlace, Place } from "~/types";
import Tiptap from "~/components/ui/tiptap";
import { SubdistrictComboBox } from "~/components/ready-use/subdistrict-combobox";
import { Button } from "~/components/ui/button";
import MapMarker from "~/components/ready-use/map-marker";
import toast from "react-hot-toast";

function Edit() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const form = useForm<NewPlace>({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      name: "",
      address: "",
      cashOnly: true,
      delivery: false,
      description: "",
      liveMusic: false,
      phoneNumber: "",
      restRoom: false,
      servesCoffee: true,
      location: {
        latitude: 0,
        longitude: 0,
      },
      openingHours: days.map((day) => ({
        day,
        openHours: "07:00",
        closeHours: "19:00",
      })),
      subdistrictId: "",
      takeout: true,
      websiteUri: "",
    },
  });
  const [subdistrict, setSubdistrict] = useState("");
  const [marker, setMarker] = useState<LocationType | null>(null);
  const [description, setDescription] = useState("");
  const { fields } = useFieldArray({
    name: "openingHours",
    control: form.control,
  });
  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  const { data } = useQuery({
    queryKey: ["place", params.id],
    queryFn: async () => {
      return axiosInstance
        .get(`/place/find?id=${params.id}`)
        .then((data) => data.data);
    },
    staleTime: Infinity,
    enabled: !!params.id,
  });

  useEffect(() => {
    if (data) {
      form.setValue("name", data.name);
      form.setValue("address", data.address);
      form.setValue("cashOnly", data.cashOnly);
      form.setValue("delivery", data.delivery);
      form.setValue("delivery", data.delivery);
      form.setValue("liveMusic", data.liveMusic);
      form.setValue("restRoom", data.restRoom);
      form.setValue("takeout", data.takeout);
      form.setValue("location.longitude", data.location.coordinates[0]);
      form.setValue("location.latitude", data.location.coordinates[1]);
      form.setValue("description", data.description);
      setDescription(data.description);
      setMarker({
        longitude: data.location.coordinates[0],
        latitude: data.location.coordinates[1],
      });
      form.setValue("openingHours", data.openingHours);
      form.setValue("phoneNumber", data.phoneNumber);
      form.setValue("subdistrictId", data.subdistrictId);
      setSubdistrict(data.subdistrictId);
      form.setValue("websiteUri", data.websiteUri ?? "");
    }
  }, [data, form]);

  const placeMutation = useMutation({
    mutationFn: async (payload: NewPlace) => {
      return axiosInstance.put("/place/" + params.id, payload);
    },
    onSuccess: () => {
      toast.success("Tempat makan berhasil diupdate");
      router.push("/manage/tempat-makan");
    },
    onError: () => {
      toast.error("Tempat makan gagal diupdate");
    },
  });

  const onSubmit = (values: NewPlace) => {
    placeMutation.mutate(values);
    // console.log(values);
  };

  return (
    <div>
      <h1>Edit Tempat Makan</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nama *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="nama"
                    {...field}
                    disabled={placeMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Alamat *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="alamat"
                    {...field}
                    disabled={placeMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
            <FormField
              control={form.control}
              name="cashOnly"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3">
                  <FormLabel className="mt-2">Cash Only</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="delivery"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3">
                  <FormLabel className="mt-2">Pengantaran</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="liveMusic"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3">
                  <FormLabel className="mt-2">Live Music</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="restRoom"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3">
                  <FormLabel className="mt-2">Ruang Istirahat</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="servesCoffee"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3">
                  <FormLabel className="mt-2">Kopi</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="takeout"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3">
                  <FormLabel className="mt-2">Takeout</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex mt-4">
                <input
                  {...form.register(`openingHours.${index}.day`)}
                  className="focus:outline-none"
                  readOnly
                />
                <div className="flex w-1/3 md:2/3 space-x-3">
                  <Input
                    {...form.register(`openingHours.${index}.openHours`)}
                    placeholder="Open Hours"
                    type="time"
                  />
                  <Input
                    {...form.register(`openingHours.${index}.closeHours`)}
                    type="time"
                    placeholder="Close Hours"
                  />
                </div>
              </div>
            ))}
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi (optional)</FormLabel>
                <FormControl>
                  <Tiptap
                    defaultValue={description}
                    onChange={field.onChange}
                    placeholder="Deskripsi singkat"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subdistrictId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Kecamatan * </FormLabel>
                <FormControl>
                  <SubdistrictComboBox
                    setValue={setSubdistrict}
                    value={subdistrict}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>No Telepon * </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="websiteUri"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Link (optional) </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Lokasi *</FormLabel>
                <FormControl>
                  <MapMarker
                    marker={marker}
                    setMarker={setMarker}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={placeMutation.isPending}>
            {placeMutation.isPending ? (
              <div className="flex gap-x-4">
                <Loader2 className="animate-spin" />
                Menyimpan
              </div>
            ) : (
              "Update"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default Edit;
