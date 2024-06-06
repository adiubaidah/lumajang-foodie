import { Suspense } from "react";
import Client from "./client";
function Register() {
  return (
    <Suspense>
      <Client />
    </Suspense>
  );
}

export default Register;
