"use client";
import { useUser } from "~/hooks";
function Client() {
  const user = useUser();
  return (
    <div>
      <h1>Selamat Datang {user?.name}</h1>
    </div>
  );
}

export default Client;
