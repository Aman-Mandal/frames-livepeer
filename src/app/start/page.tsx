"use client";

import { useSearchParams } from "next/navigation";
import { Livepeer } from "livepeer";
import { useEffect, useState } from "react";
import { TypeT } from "livepeer/dist/models/components";
import { ethers } from "ethers";
import { ABI } from "../constants";
import { useRouter } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const [policy, setPolicy] = useState(null);
  const [playbackId, setPlaybackId] = useState(null);
  const router = useRouter();

  const id = searchParams.get("id");

  const livepeer = new Livepeer({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_KEY,
  });

  useEffect(() => {
    async function getData() {
      const res = await livepeer.stream.get(id as string);
      const str = String.fromCharCode.apply(String, res.rawResponse?.data);
      const obj = JSON.parse(str);

      setPolicy(obj.playbackPolicy.type);
      setPlaybackId(obj.playbackId);
    }
    if (id) {
      getData();
    }
  }, [id]);

  const streamHandler = async () => {
    if (policy === TypeT.Jwt) {
      //@ts-ignore
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      const contract = new ethers.Contract("0x", ABI, signer);

      const balance = await contract.balanceOf(await signer.getAddress());

      const nftBalance = Number(balance.toString());

      if (nftBalance !== 0) {
        const data = await fetch("/api/jwt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            playbackId,
          }),
        });

        const res = await data.json();

        localStorage.setItem("token", res.token);
        router.push(`/live?playbackId=${playbackId}`);
      }
    }
  };

  return (
    <div>
      <button onClick={streamHandler}>Watch stream</button>
    </div>
  );
}
