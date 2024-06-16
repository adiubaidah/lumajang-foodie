"use client"
import React from "react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CardMenu from "./components/card";

import { axiosInstance, createQueryString } from "~/lib/utils";
import { Button } from "~/components/ui/button";
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
      <h1>Daftar Makanan dan Minuman</h1>
      <div></div>

      <div className="grid gap-x-10 gap-y-11 py-3 md:grid-cols-3">
        {isLoading || !data
          ? "Loading"
          : data.result && data.result.length > 0
            ? data.result.map((menu: MenuWithPhoto) => (
                <CardMenu
                  key={menu.id}
                  price={menu.price}
                  title={menu.name}
                  slug={menu.slug}
                  srcImage={menu.photo}
                  rate={menu.averageStar}
                />
              ))
            : "Data tidak ditemukan"}
      </div>
    </>
  );
}

export default Client;
