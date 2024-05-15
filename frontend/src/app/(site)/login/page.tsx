import { Metadata } from "next";
import { Suspense } from "react";
import Client from "./client";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Login",
  };
}

export default function Login() {
  return (
    <Suspense>
      <Client />
    </Suspense>
  );
}
