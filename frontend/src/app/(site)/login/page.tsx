import { Suspense } from "react";
import Client from "./client";
export default function Login() {
  return (
    <Suspense>
      <Client />
    </Suspense>
  );
}
