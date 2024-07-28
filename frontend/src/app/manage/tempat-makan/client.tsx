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
import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "~/components/ui/button";
import { useAuth } from "~/hooks";
import { axiosInstance, imageFromBackend } from "~/lib/utils";
import { Place, PlacePhoto } from "~/types";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "~/components/ui/dropdown-menu";
import Link from "next/link";

function Client() {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["place", { user: user && user.id }],
    queryFn: async () => {
      return axiosInstance
        .get("/place/by-owner/" + user.id)
        .then((data) => data.data);
    },
    staleTime: 5 * 1000 * 60,
    enabled: user && !!user.id,
  });
  return (
    <div className="h-full overflow-y-auto">
      <div className="flex justify-between">
        <h1>Daftar Tempat makan</h1>
        <Link
          href="/manage/tempat-makan/tambah"
          className={buttonVariants({ variant: "outline" })}
        >
          Tambah Tempat Makan
        </Link>
      </div>
      <Table>
        <TableHeader className="hidden md:table-header-group">
          <TableRow>
            <TableHead>Gambar</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((place: Place & { photos: PlacePhoto[] }) => (
            <TableRow
              key={place.id}
              className="flex flex-col items-center md:table-row"
            >
              <TableCell className="block md:table-cell">
                {place.photos.length > 0 && (
                  <SkeletonImage
                    src={place.photos ? imageFromBackend(place.photos[0].url) : "/assets/restaurant_default.png"}
                    alt={place.name}
                    skeletonStyle={{ width: 128, height: "auto" }}
                    className="w-64 object-cover"
                    width={800}
                    height={800}
                  />
                )}
              </TableCell>
              <TableCell className="block md:table-cell">
                {place.name}
              </TableCell>
              <TableCell className="block md:table-cell">
                {place.slug}
              </TableCell>
              <TableCell className="block space-x-3 md:table-cell">
                <div className="flex items-center gap-x-3 md:hidden">
                  <Link
                    className={cn(
                      "space-x-3",
                      buttonVariants({
                        size: "icon",
                        className: "bg-blue-500 hover:bg-blue-400",
                      }),
                    )}
                    href={`/manage/tempat-makan/${place.id}/photo`}
                  >
                    <ImageIcon size={16} />
                  </Link>
                  <Link
                    className={cn(
                      "space-x-3",
                      buttonVariants({
                        size: "icon",
                        className: "bg-yellow-500 hover:bg-yellow-400",
                      }),
                    )}
                    href={`/manage/tempat-makan/${place.id}/edit`}
                  >
                    <PencilIcon size={16} />
                  </Link>
                  <Link
                    className={cn(
                      "space-x-3",
                      buttonVariants({
                        size: "icon",
                        className: "bg-green-500 hover:bg-green-400",
                      }),
                    )}
                    href={`/manage/tempat-makan/${place.id}/menu`}
                  >
                    <Menu size={16} />
                  </Link>
                  <Button
                    className="space-x-3"
                    size={"icon"}
                    variant={"destructive"}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="hidden md:block">
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
                        <a href={`/manage/tempat-makan/${place.id}/edit`}>
                          Edit
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="space-x-3">
                        <Menu size={16} color="green" />
                        <a href={`/manage/tempat-makan/${place.id}/menu`}>
                          Menu
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="space-x-3">
                        <Trash2 size={16} color="red" />
                        <span>Hapus</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default Client;
