import { Suspense } from "react";
import Client from "./client";
function TempatMakan() {
  return (
    <Suspense>
      <Client />
    </Suspense>
  );
}

export default TempatMakan;
