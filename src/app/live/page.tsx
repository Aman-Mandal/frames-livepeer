"use client";

import { Suspense } from "react";
import StartComponent from "../components/Navbar/start/StartComponent";

export default function Live() {
  return (
    <>
      <Suspense>
        <StartComponent />
      </Suspense>
    </>
  );
}
