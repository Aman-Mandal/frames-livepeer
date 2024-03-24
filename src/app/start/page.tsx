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
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_KEY_ONE,
  });

  useEffect(() => {
    async function getData() {
      const res = await livepeer.stream.get(id as string);
      console.log("res", res.stream);
      // const str = String.fromCharCode.apply(String, res.rawResponse?.data);
      // console.log("str", str);
      // const obj = JSON.parse(str);
      const obj = res.stream as any;
      // console.log("obj", str, obj);
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
      const provider = new ethers.BrowserProvider(window.ethereum);

      const signer = await provider.getSigner();

      console.log("signer", signer);
      const contract = new ethers.Contract(
        "0x163472941c37Ad917C7D223C8Fc196FD567c7d56",
        ABI,
        signer
      );
      const address = await signer.getAddress();

      console.log("address", address);
      const balance = await contract.balanceOf(address);

      console.log("balance", balance);

      const nftBalance = Number(balance.toString());

      console.log("ff", nftBalance);
      console.log("pp", playbackId);

      if (nftBalance !== 0) {
        const data = await fetch("/api/jwt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            playbackId,
          }),
          cache: "no-store",
        });

        console.log("data", data);
        const res = await data.json();
        console.log("resss", res);

        console.log("result", res.token, playbackId);
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
