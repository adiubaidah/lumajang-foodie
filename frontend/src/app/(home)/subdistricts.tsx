"use client";
import React from "react";
import { ChevronRight, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/utils";

function Subdistricts() {
  const { data: subdistricts } = useQuery({
    queryKey: ["subdistrict", { place: 1 }],
    queryFn: async () => {
      return (await axiosInstance.get("/subdistrict?place=1")).data;
    },
  });
  return (
    <React.Fragment>
      <h2 className="font-product-sans text-4xl font-light text-[#363636]">
        Tersebar ke berbagai Kecamatan
      </h2>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {subdistricts &&
          subdistricts.length > 0 &&
          subdistricts.map((subdistrict: any) => (
            <div
              key={subdistrict.id}
              className="flex cursor-pointer items-center justify-between rounded-lg border-[1px] border-gray-200 px-3 py-3.5 shadow-[0_4px_5px_0_rgba(28,28,28,0.08)]"
            >
              <span>
                <h5 className="text-xl text-[#363636]">{subdistrict.name}</h5>
                <p className="text-[#363636]">
                  {subdistrict._count.Place} Tempat
                </p>
              </span>
              <ChevronRight />
            </div>
          ))}
      </div>
    </React.Fragment>
  );
}

export default Subdistricts;
