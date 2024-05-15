import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "~/components/ui/dialog";
import { ModalProps } from "~/types";
import { Role } from "~/constant";
import { DataModal } from "../page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";

export type FilterType = {
  role: typeof Role | null;
  isActive: number;
};

export interface FilterProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}

function Filter({
  body,
  isOpen,
  setIsOpen,
  filter,
  setFilter,
}: ModalProps<DataModal> & FilterProps) {
  const [filterData, setFilterData] = useState<FilterType>({
    isActive: 0,
    role: null,
  });
  return (
    <Dialog
      open={isOpen && body.operation === "filter"}
      onOpenChange={setIsOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter User</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setFilter(filterData);
          }}
        >
          <Select
            value={filterData.role?.toString() || "null"}
            onValueChange={(value) =>
              setFilterData({
                ...filterData,
                role:
                  value === "null" ? null : (value as unknown as typeof Role),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="null">Pilih role</SelectItem>
              <SelectItem value="foodie">Foodie</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterData.isActive.toString()}
            onValueChange={(value) =>
              setFilterData({ ...filterData, isActive: Number(value) })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Status</SelectItem>
              <SelectItem value="-1">Nonaktif</SelectItem>
              <SelectItem value="1">Aktif</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit">Terapkan</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Filter;
