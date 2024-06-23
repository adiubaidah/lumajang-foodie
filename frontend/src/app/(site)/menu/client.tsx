"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CardMenu from "./components/card";

import { axiosInstance, createQueryString, cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import Loader from "~/components/ready-use/loader";
import { MenuWithPhoto } from "~/types";

function Client() {
  const { data, isLoading } = useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      return (await axiosInstance.get(`/menu`)).data;
    },
  });

  return (
    <>
      <div
        className={cn(
          "grid gap-x-10 gap-y-11 py-3",
          !isLoading && "md:grid-cols-3",
        )}
      >
        {isLoading || !data ? (
          <div className="grid h-60 place-content-center">
            <Loader />
          </div>
        ) : data.result && data.result.length > 0 ? (
          data.result.map((menu: MenuWithPhoto) => (
            <CardMenu
              key={menu.id}
              price={menu.price}
              title={menu.name}
              slug={menu.slug}
              srcImage={menu.photo}
              rate={menu.averageStar}
            />
          ))
        ) : (
          "Data tidak ditemukan"
        )}
      </div>
    </>
  );
}

export default Client;
