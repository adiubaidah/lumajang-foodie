"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { axiosInstance, imageFromBackend, rupiah } from "~/lib/utils";
import { Add, Edit, Delete } from "./components";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import SkeletonImage from "~/components/ready-use/skeleton-image";
import { Button } from "~/components/ui/button";
import { MenuWithPhoto, ModalCrud } from "~/types";



export interface DataModal {
  data?: MenuWithPhoto;
  operation: ModalCrud;
}
function Menu() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ["menu", { place: params.id }],
    queryFn: async () => {
      return (await axiosInstance.get(`/menu?place=${params.id}`)).data;
    },
    enabled: !!params.id,
  });
  const [dataModal, setDataModal] = useState<DataModal>({
    operation: "delete",
  });
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <h1>Daftar Menu</h1>
          <Button
            onClick={() => {
              setDataModal({
                operation: "add",
              });
              setOpenModal(true);
            }}
            variant={"outline"}
          >
            Tambah Menu
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gambar</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jenis Menu</TableHead>
              <TableHead>Harga</TableHead>
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
            ) : data && data.result.length > 0 ? (
              data.result.map((menu: MenuWithPhoto) => (
                <TableRow key={menu.id}>
                  <TableCell>
                    <SkeletonImage
                      src={imageFromBackend(menu.photo)}
                      alt="photo"
                      height={400}
                      className="aspect-video w-64 object-cover"
                      skeletonStyle={{ width: 256, aspectRatio: 16 / 9 }}
                      width={400}
                    />
                  </TableCell>
                  <TableCell>{menu.name}</TableCell>
                  <TableCell>{menu.type}</TableCell>
                  <TableCell>{rupiah(menu.price)}</TableCell>
                  <TableCell className="space-x-3">
                    <Button
                      size={"icon"}
                      type="button"
                      onClick={() => {
                        setDataModal({
                          data: menu,
                          operation: "edit",
                        });
                        setOpenModal(true);
                      }}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant={"destructive"}
                      type="button"
                      onClick={() => {
                        setDataModal({
                          data: menu,
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
      <Edit
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

export default Menu;
