"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Subdistrict } from "~/types";
import { cn, axiosInstance } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandList,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ClassValue } from "clsx";

interface SubdistrictComboBoxProps {
  value: string;
  setValue: (value: string) => void;
  onChange: (value: string) => void;
  buttonClassName?: ClassValue;
  contentClassName?: ClassValue;
}

export function SubdistrictComboBox({
  value,
  setValue,
  onChange,
  buttonClassName,
  contentClassName,
}: SubdistrictComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const { data = [] } = useQuery<Subdistrict[]>({
    queryKey: ["subdistrict"],
    queryFn: async () => {
      return axiosInstance.get("/subdistrict").then((data) => data.data);
    },
    staleTime: Infinity,
  });

  return (
    data && (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-[200px] justify-between", buttonClassName)}
          >
            {value
              ? data.find((subdistrict) => subdistrict.id === value)?.name
              : "Pilih kecamatan..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Cari Kecamatan" />
            <CommandEmpty>Kecamatan tidak ditemukan.</CommandEmpty>
            <CommandList>
              {data.map((subdistrict) => (
                <CommandItem
                  key={subdistrict.id}
                  value={subdistrict.id}
                  onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    onChange(subdistrict.id);
                    // console.log(currentValue);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === subdistrict.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {subdistrict.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  );
}
