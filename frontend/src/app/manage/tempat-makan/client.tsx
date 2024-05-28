"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Image as ImageIcon,
  Menu,
  MoreHorizontal,
  PencilIcon,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Anchor } from "~/components/ui/anchor";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/hooks";
import { axiosInstance } from "~/lib/utils";
import { Place, PlacePhoto } from "~/types";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "~/components/ui/dropdown-menu";

function Client() {
  const user = useAuth();
  const { data } = useQuery({
    queryKey: ["place"],
    queryFn: async () => {
      return axiosInstance
        .get("/place/by-owner/" + user.id)
        .then((data) => data.data);
    },
    staleTime: 5 * 1000 * 60,
    enabled: !!user.id,
  });
  return (
    <div>
      <div className="flex justify-between">
        <h1>Daftar Tempat makan</h1>
        <Anchor href="/manage/tempat-makan/tambah" variant={"outline"}>
          Tambah Tempat Makan
        </Anchor>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Gambar</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((place: Place & { photos: PlacePhoto[] }) => (
            <TableRow key={place.id}>
              <TableCell>
                {place.photos.length > 0 ? (
                  <SkeletonImage
                    src={place.photos[0].url}
                    alt="Foto"
                    skeletonStyle={{ width: 96, height: 40 }}
                    className="w-24"
                    width={500}
                    height={500}
                  />
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>{place.name}</TableCell>
              <TableCell>{place.slug}</TableCell>
              <TableCell className="space-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="space-x-3">
                      <ImageIcon size={16} color="blue" />
                      <a href={`/manage/tempat-makan/${place.id}/photo`}>
                        Foto
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="space-x-3">
                      <PencilIcon size={16} color="yellow" />
                      <a href={`/manage/tempat-makan/${place.id}/edit`}>Edit</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="space-x-3">
                      <Menu size={16} color="green" />
                      <a href={`/manage/tempat-makan/${place.id}/menu`}>Menu</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="space-x-3">
                      <Trash2 size={16} color="red" />
                      <span>Hapus</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Client;
