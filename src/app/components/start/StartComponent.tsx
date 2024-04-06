import { ethers } from "ethers";
import { Livepeer } from "livepeer";
import { ABI } from "../../constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TypeT } from "livepeer/dist/models/components";
import { GetStreamResponse } from "livepeer/dist/models/operations";

export default function StartComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [policy, setPolicy] = useState<TypeT | null>(null);
  const [playbackId, setPlaybackId] = useState<string | null>(null);

  const id = searchParams.get("id");
  const tokenAddress = searchParams.get("tokenAddress");

  const livepeer = new Livepeer({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_KEY_ONE,
  });

  useEffect(() => {
    async function getData() {
      const res: GetStreamResponse = await livepeer.stream.get(id as string);
      const obj = res.stream;

      if (!obj || !obj.playbackId) return;

      setPolicy(obj.playbackPolicy ? obj.playbackPolicy.type : TypeT.Public);
      setPlaybackId(obj.playbackId);
    }
    if (id) {
      getData();
    }
  }, [id]);

  const fetchJwt = async () => {
    try {
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

      const res = await data.json();

      return res;
    } catch (error) {
      console.log("error", error);
    }
  };

  const streamHandler = async () => {
    if (policy === TypeT.Jwt) {
      //@ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(tokenAddress as string, ABI, signer);
      const address = await signer.getAddress();

      const balance = await contract.balanceOf(address);
      const nftBalance = Number(balance.toString());

      if (nftBalance !== 0) {
        const res = await fetchJwt();

        localStorage.setItem("token", res.token);
        router.push(`/live?playbackId=${playbackId}`);
      }
    } else {
      if (playbackId) {
        router.push(`/normal?playbackId=${playbackId}`);
      } else {
        throw new Error("No playbackId found");
      }
    }
  };

  return (
    <div>
      <button onClick={streamHandler}>Watch stream</button>
    </div>
  );
}
