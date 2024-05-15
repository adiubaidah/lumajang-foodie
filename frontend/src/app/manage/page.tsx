import { Suspense } from "react";
import Client from "./client";
export default function Manage() {
  return (
    <Suspense>
      <Client />
    </Suspense>
  );
}
