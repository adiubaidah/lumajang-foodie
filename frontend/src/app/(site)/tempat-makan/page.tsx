import { Suspense } from "react";
import { Metadata } from "next";
import Client from "./client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tempat Makan",
  };
}

function TempatMakan() {
  return (
    <Suspense>
      <Client />
    </Suspense>
  );
}

export default TempatMakan;
