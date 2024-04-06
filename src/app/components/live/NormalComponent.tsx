"use client";

import { Livepeer } from "livepeer";
import { useEffect, useState } from "react";
import * as Player from "@livepeer/react/player";
import { getSrc } from "@livepeer/react/external";
import { useSearchParams } from "next/navigation";
import { PauseIcon, PlayIcon } from "@livepeer/react/assets";

export default function NormalComponent() {
  const [src, setSrc] = useState<any>(null);
  const searchParams = useSearchParams();

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
  }, [livepeer.playback, playbackId]);

  return (
    <>
      {src && (
        <div>
          <Player.Root src={src}>
            <Player.Container>
              <Player.Video />

              <Player.Controls className="flex items-center justify-center">
                <Player.PlayPauseTrigger className="w-10 h-10">
                  <Player.PlayingIndicator asChild matcher={false}>
                    <PlayIcon />
                  </Player.PlayingIndicator>
                  <Player.PlayingIndicator asChild>
                    <PauseIcon />
                  </Player.PlayingIndicator>
                </Player.PlayPauseTrigger>
              </Player.Controls>
            </Player.Container>
          </Player.Root>
        </div>
      )}
    </>
  );
}
