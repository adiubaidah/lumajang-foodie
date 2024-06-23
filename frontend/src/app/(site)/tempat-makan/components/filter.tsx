import React, { SetStateAction, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Slider } from "~/components/ui/slider";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn, createQueryString } from "~/lib/utils";
import { Checkbox } from "~/components/ui/checkbox";
import { useUserLocation } from "~/hooks";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Location as LocationType } from "~/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";

type OtherFilter = {
  openNow: number;
  servesCoffee: number;
  cashOnly: number;
  liveMusic: number;
  delivery: number;
  restRoom: number;
  takeout: number;
};

export const filterOther: { id: keyof OtherFilter; label: string }[] = [
  { id: "takeout", label: "Takeout" },
  { id: "delivery", label: "Pengantaran" },
  { id: "liveMusic", label: "Live Music" },
  { id: "cashOnly", label: "Hanya Cash" },
  { id: "servesCoffee", label: "Kopi" },
  { id: "openNow", label: "Buka sekarang" },
];

export type FilterData = {
  sort: string;
  q: string;
  other: OtherFilter;
};

type FilterProps = {
  filter: FilterData;
  path: string;
  router: AppRouterInstance;
  location: LocationType | null;
};

// const

function Filter({ filter, path, router, location }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterData, setFilterData] = useState<FilterData>({
    sort: "name:asc",
    other: {
      cashOnly: 0,
      delivery: 0,
      liveMusic: 0,
      openNow: 0,
      restRoom: 0,
      servesCoffee: 0,
      takeout: 0,
    },
  });

  useEffect(() => {
    setFilterData(filter);
  }, [filter]);

  const handleSort = (value: string) => {
    // console.log(value);
    setFilterData({ ...filterData, sort: value });
  };

  const handleOther = (key: keyof OtherFilter) => {
    setFilterData({
      ...filterData,
      other: {
        ...filterData.other,
        [key]: filterData.other[key] === 1 ? 0 : 1,
      },
    });
  };

  const handleSubmit = () => {
    //ambil semua nilai state
    const filteredOther = Object.entries(filterData.other)
      .filter(([key, value]) => value !== 0)
      .reduce<Record<string, number>>((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    // Merge the filtered 'other' object with 'sort'
    const queryData: Record<string, any> = {
      sort: filterData.sort,
      ...filteredOther,
    };
    const query = createQueryString(queryData);
    router.replace(query ? `${path}?${query}` : path);

    //semisal
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Filter</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[700px] px-0">
        <DialogHeader className="px-5">
          <DialogTitle>Filter</DialogTitle>
        </DialogHeader>
        <Separator />

        <Tabs className="-mb-4 -mt-4 flex items-center">
          <TabsList className="flex h-fit flex-col items-start rounded-none bg-gray-200 px-0 py-0">
            <TabsTrigger className="w-full py-7 pl-5" value="sort">
              Urutkan
            </TabsTrigger>
            <TabsTrigger className="w-full py-7 pl-5" value="rate">
              Rating
            </TabsTrigger>
            <TabsTrigger className="w-full py-7 pl-5" value="other">
              Filter Lainnya
            </TabsTrigger>
          </TabsList>
          <div className="w-full px-5 py-6">
            <TabsContent value="sort">
              <RadioGroup
                className="space-y-4"
                value={filterData.sort}
                onValueChange={handleSort}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="popular" />
                  <Label htmlFor="popular">Popularitas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="name:asc" />
                  <Label htmlFor="name:asc">Nama: A - Z</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="name:desc" />
                  <Label htmlFor="name:descr">Nama: Z - A</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="distance" disabled={!!!location} />
                  <Label htmlFor="distance">Jarak</Label>
                </div>
              </RadioGroup>
            </TabsContent>
            <TabsContent value="rate">
              <div className="flex flex-col items-center justify-center">
                <Slider defaultValue={[1]} step={0.5} max={5} min={0} />
                <div className="mt-1.5 flex w-full flex-row justify-between px-1">
                  {Array.from({ length: 11 }).map((_, i) => {
                    // Calculate the value at each step, including half steps.
                    const value = (i * 0.5).toFixed(1);
                    return (
                      <span
                        key={`slider-${i}`}
                        className="text-sm font-light"
                        role="presentation"
                      >
                        {/* Display the value for the first, middle, and last marks; otherwise, display a vertical bar. */}
                        {i === 0 || i === 10
                          ? parseInt(value, 10)
                          : i === 5
                            ? 2.5
                            : "|"}
                      </span>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="other" className="space-y-3">
              {filterOther.map((fto) => (
                <div key={fto.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={fto.id}
                    checked={filterData.other[fto.id] === 1}
                    onCheckedChange={() => handleOther(fto.id)}
                  />
                  <Label htmlFor={fto.id}>{fto.label}</Label>
                </div>
              ))}
            </TabsContent>
          </div>
        </Tabs>
        <Separator />
        <DialogFooter className="flex px-5">
          <Button variant={"secondary"}>Reset</Button>
          <Button onClick={handleSubmit}>Terapkan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Filter;
