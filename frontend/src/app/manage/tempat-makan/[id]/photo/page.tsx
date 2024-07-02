"use client";
import { useState } from "react";
import { useParams } from "next/navigation";

import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { ModalCrud, PlacePhoto } from "~/types";
import { Button } from "~/components/ui/button";
import Add from "./components/add";
import { axiosInstance, imageFromBackend } from "~/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import Delete from "./components/delete";
import { useQuery } from "@tanstack/react-query";

export interface DataModal {
  data?: PlacePhoto;
  operation: ModalCrud;
}

function Image() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ["place-photo", { place: params.id }],
    queryFn: async () => {
      return axiosInstance
        .get(`/place-photo?place=${params.id}`)
        .then((data) => data.data);
    },
    enabled: !!params.id,
    staleTime: 1000 * 60 * 5,
  });
  const [dataModal, setDataModal] = useState<DataModal>({
    operation: "delete",
  });
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <h1>Daftar Foto</h1>
          <Button
            onClick={() => {
              setDataModal({
                operation: "add",
              });
              setOpenModal(true);
            }}
            variant={"outline"}
          >
            Tambah Foto
          </Button>
        </div>

        <Table>
          <TableHeader className="hidden md:table-header-group">
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || !data ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex items-center justify-center gap-x-3">
                    <Loader2 className="animate-spin" />
                    <span>Mengambil data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.result && data.result.length > 0 ? (
              data.result.map((photo: PlacePhoto) => (
                <TableRow key={photo.id} className="flex flex-col items-center md:table-row">
                  <TableCell className="block  md:table-cell">
                    <SkeletonImage
                      src={imageFromBackend(photo.url)}
                      alt="photo"
                      height={400}
                      className="aspect-video w-64"
                      skeletonStyle={{ width: 256, aspectRatio: 16 / 9 }}
                      width={400}
                    />
                  </TableCell>
                  <TableCell className="block w-full text-center md:w-fit md:table-cell">{photo.type}</TableCell>
                  <TableCell className="block space-x-3  md:table-cell">
                    <Button size={"icon"}>
                      <Pencil />
                    </Button>
                    <Button
                      variant={"destructive"}
                      type="button"
                      onClick={() => {
                        setDataModal({
                          operation: "delete",
                        });
                        setOpenModal(true);
                      }}
                      size={"icon"}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex items-center justify-center">
                    <span>Data tidak ditemukan</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Add
        placeId={params.id}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        body={dataModal}
      />
      <Delete
        placeId={params.id}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        body={dataModal}
      />
    </>
  );
}

export default Image;
