import React, { Suspense } from "react";
import { Metadata } from "next";
import Client from "./client";


export async function generateMetadata(): Promise<Metadata> {
    return {
      title: "Menu",
    };
  }

function Menu() {
  return (
    <Suspense>
      <Client />
    </Suspense>
  );
}

export default Menu;
