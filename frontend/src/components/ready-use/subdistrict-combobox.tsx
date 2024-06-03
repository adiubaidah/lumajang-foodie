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

interface SubdistrictComboBoxProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onChange: (value: string) => void;
}

export function SubdistrictComboBox({
  value,
  setValue,
  onChange,
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
            className="w-[200px] justify-between"
          >
            {value
              ? data.find((subdistrict) => subdistrict.id === value)?.name
              : "Pilih kecamatan..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search subdistrict..." />
            <CommandEmpty>Kecamatan tidak ditemukan.</CommandEmpty>
            <CommandList>
              {data.map((subdistrict) => (
                <CommandItem
                  key={subdistrict.id}
                  onSelect={() => {
                    setValue(subdistrict.id);
                    setOpen(false);
                    onChange(subdistrict.id);
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
