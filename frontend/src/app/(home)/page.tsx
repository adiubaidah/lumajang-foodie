import { Suspense } from "react";
import Home from "./client";
function Page() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}

export default Page;
