"use client";

import * as Player from "@livepeer/react/player";
import { getSrc } from "@livepeer/react/external";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Livepeer } from "livepeer";
import { useState } from "react";

export default function LiveComponent() {
  const [src, setSrc] = useState<any>(null);
  const searchParams = useSearchParams();

  const jwt = localStorage.getItem("token");

  const playbackId = searchParams.get("playbackId");

  const livepeer = new Livepeer({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_KEY,
  });

  useEffect(() => {
    async function getData() {
      const playbackInfo = await livepeer.playback.get(playbackId as string);

      const src = getSrc(playbackInfo.playbackInfo);

      setSrc(src);
    }
    getData();
  }, []);

  return (
    <>
      {src && (
        <div>
          <Player.Root src={src} jwt={jwt}>
            <Player.Container>
              <Player.Video />
            </Player.Container>
          </Player.Root>
        </div>
      )}
    </>
  );
}
