'use client';

import * as Player from '@livepeer/react/player';
import { getSrc } from '@livepeer/react/external';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Livepeer } from 'livepeer';
import { useState } from 'react';
import { PauseIcon, PlayIcon } from '@livepeer/react/assets';

export default function LiveComponent() {
  const [src, setSrc] = useState<any>(null);
  const [jwt, setJwt] = useState<any>(null);
  const searchParams = useSearchParams();

  const playbackId = searchParams.get('playbackId');

  const livepeer = new Livepeer({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_KEY,
  });

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');

    async function getData() {
      const playbackInfo = await livepeer.playback.get(playbackId as string);

      const src = getSrc(playbackInfo.playbackInfo);

      setSrc(src);
      setJwt(jwtToken);
    }
    getData();
  }, [playbackId]);

  return (
    <>
      {src && (
        <div>
          <Player.Root
            src={src}
            jwt={jwt}>
            <Player.Container>
              <Player.Video className='h-full w-full' />
            </Player.Container>
            <Player.Controls className='flex items-center justify-center'>
              <Player.PlayPauseTrigger className='w-10 h-10'>
                <Player.PlayingIndicator
                  asChild
                  matcher={false}>
                  <PlayIcon />
                </Player.PlayingIndicator>
                <Player.PlayingIndicator asChild>
                  <PauseIcon />
                </Player.PlayingIndicator>
              </Player.PlayPauseTrigger>
            </Player.Controls>
          </Player.Root>
        </div>
      )}
    </>
  );
}
