"use client";
import { ClassValue } from "clsx";
import { z } from "zod";
import { useDebouncedCallback } from "use-debounce";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { MapPin, Search } from "lucide-react";
import { cn } from "~/lib/utils";
import { SubdistrictComboBox } from "./subdistrict-combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface SearchInputProps {
  className?: ClassValue;
  formClassName?: ClassValue;
}

function SearchInput({ className, formClassName }: SearchInputProps) {
  const searchParams = useSearchParams();
  const path = usePathname();
  const router = useRouter();
  const search = searchParams.get("q") || "";
  const subdistrict = searchParams.get("subdistrict") || "";
  // const [subdistrictValue, setSubdistrictValue] = useState("")
  // useEffect(() => {
  //   form.setValue("search", search);
  //   form.setValue("subdistrict", subdistrict);
  // }, [search, subdistrict]);

  const handleSubdistrictChange = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("subdistrict", value);
    } else {
      params.delete("subdistrict");
    }
    const queryString = params.toString();
    router.replace(`${path}?${queryString}`);
  }, 300);

  const handleSearchChange = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      const queryString = params.toString();
      router.replace(`${path}?${queryString}`);
      // setSubdistrictValue(value)
    },
    400,
  );

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const queryString = params.toString();
    if (path !== "/tempat-makan" && path !== "/menu") {
      const targetPath = `/tempat-makan?${queryString}`;
      router.push(targetPath);
    } else {
      const updatedPath = `${path}?${queryString}`;
      router.replace(updatedPath);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "mt-3 flex flex-col items-center gap-x-4 gap-y-3 bg-transparent p-2 md:flex-row md:rounded-lg md:bg-white md:shadow-[0_4px_4px_rgba(0,0,0,0.25)]",
        formClassName,
      )}
    >
      <div className="flex w-full items-center space-y-0 rounded-lg bg-white px-2 md:max-w-[230px]">
        <div className="">
          <MapPin className="text-puce" />
        </div>
        <SubdistrictComboBox
          value={subdistrict}
          setValue={handleSubdistrictChange}
          onChange={() => {}}
          buttonClassName="w-full border-none px-2"
        />
      </div>
      {/* <FormMessage /> */}

      <div className="flex w-full items-center gap-x-2 space-y-0 rounded-lg bg-white p-2 md:p-0">
        <div>
          <Search />
        </div>
        <input
          type="text"
          placeholder="Cari makanan atau tempat makan"
          defaultValue={search}
          onChange={handleSearchChange}
          className={cn(
            "w-full outline-none placeholder:font-thin placeholder:text-stroke",
            className,
          )}
        />
      </div>
    </form>
  );
}

export default SearchInput;
