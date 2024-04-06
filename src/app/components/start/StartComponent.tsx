import { useSearchParams } from 'next/navigation';
import { Livepeer } from 'livepeer';
import { Suspense, useEffect, useState } from 'react';
import { TypeT } from 'livepeer/dist/models/components';
import { ethers } from 'ethers';
import { ABI } from '../../constants';
import { useRouter } from 'next/navigation';
import { GetStreamResponse } from 'livepeer/dist/models/operations';

export default function StartComponent() {
  const searchParams = useSearchParams();
  const [policy, setPolicy] = useState<TypeT | null>(null);
  const [playbackId, setPlaybackId] = useState<string | null>(null);
  const router = useRouter();

  const id = searchParams.get('id');

  const livepeer = new Livepeer({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_KEY_ONE,
  });

  useEffect(() => {
    async function getData() {
      const res: GetStreamResponse = await livepeer.stream.get(id as string);

      console.log('res', res.stream);
      // const str = String.fromCharCode.apply(String, res.rawResponse?.data);
      // console.log("str", str);
      // const obj = JSON.parse(str);
      const obj = res.stream;
      if (!obj || !obj.playbackId) return;

      // console.log("obj", str, obj);
      setPolicy(obj.playbackPolicy ? obj.playbackPolicy.type : TypeT.Public);
      setPlaybackId(obj.playbackId);
    }
    if (id) {
      getData();
    }
  }, [id]);

  const streamHandler = async () => {
    if (policy === TypeT.Jwt) {
      //@ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);

      const signer = await provider.getSigner();

      console.log('signer', signer);
      const contract = new ethers.Contract(
        '0x163472941c37Ad917C7D223C8Fc196FD567c7d56',
        ABI,
        signer
      );
      const address = await signer.getAddress();
      const balance = await contract.balanceOf(address);
      const nftBalance = Number(balance.toString());

      if (nftBalance !== 0) {
        const data = await fetch('/api/jwt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            playbackId,
          }),
          cache: 'no-store',
        });

        const res = await data.json();

        localStorage.setItem('token', res.token);
        router.push(`/live?playbackId=${playbackId}`);
      }
    } else {
      if (playbackId) {
        router.push(`/normal?playbackId=${playbackId}`);
      } else {
        throw new Error('No playbackId found');
      }
    }
  };

  return (
    <div>
      {/* <Suspense> */}
      {/* <Navbar /> */}
      <button onClick={streamHandler}>Watch stream</button>
      {/* </Suspense> */}
    </div>
  );
}
