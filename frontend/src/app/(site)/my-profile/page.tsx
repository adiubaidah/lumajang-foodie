import { Suspense } from "react";
import Client from "./client";

function UserDetail() {
  return (
    <Suspense>
      <Client />
    </Suspense>
  );
}

export default UserDetail;
