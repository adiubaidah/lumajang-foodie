"use client";
import { useAuth } from "~/hooks";
function Client() {
  const { user } = useAuth();
  return (
    <div>
      <h1>Selamat Datang {user?.name}</h1>
    </div>
  );
}

export default Client;
