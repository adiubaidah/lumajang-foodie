"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, PencilIcon, Trash2 } from "lucide-react";
import { axiosInstance } from "~/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHead,
} from "~/components/ui/table";
import { User, ModalCrud } from "~/types";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { FilterComponent } from "./components";
import { FilterType } from "./components/filter";

export interface DataModal {
  data?: User;
  operation: ModalCrud | "filter";
}

function Users() {
  const [openModal, setOpenModal] = useState(false);
  const [dataModal, setDataModal] = useState<DataModal>({
    operation: "delete",
  });
  const [filter, setFilter] = useState<FilterType>({
    role: null,
    isActive: 0,
  });
  const { data = [] } = useQuery<User[]>({
    queryKey: ["users", filter.isActive, filter.role],
    queryFn: async () => {
      return axiosInstance
        .get(`/user?isActive=${filter.isActive}&role=${filter.role ?? ""}`)
        .then((data) => data.data);
    },
    staleTime: 5 * 1000 * 6,
  });

  useEffect(() => {
    console.log(filter);
  }, [filter]);
  return (
    <>
      <div className="flex justify-between">
        <h1>Daftar User</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => {
            setOpenModal(true);
            setDataModal({
              operation: "filter",
            });
          }}
        >
          <Filter />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {
                  <Badge variant={user.isActive ? "default" : "destructive"}>
                    {user.isActive ? "Aktif" : "Nonaktif"}{" "}
                  </Badge>
                }
              </TableCell>
              <TableCell className="space-x-3">
                <Button size={"icon"}>
                  <PencilIcon />
                </Button>
                <Button variant={"destructive"} size={"icon"}>
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <FilterComponent
        body={dataModal}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        filter={filter}
        setFilter={setFilter}
      />
    </>
  );
}

export default Users;
