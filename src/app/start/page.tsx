"use client";

import { Suspense } from "react";
import StartComponent from "../components/start/StartComponent";

export default function Start() {
  return (
    <Suspense>
      <StartComponent />
    </Suspense>
  );
}
