"use client";

import { Suspense } from "react";
import LiveComponent from "../components/live/LiveComponent";

export default function Live() {
  return (
    <>
      <Suspense>
        <LiveComponent />
      </Suspense>
    </>
  );
}
