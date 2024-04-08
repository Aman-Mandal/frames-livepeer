import { ethers } from 'ethers';
import { Livepeer } from 'livepeer';
import { ABI } from '../../constants';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { TypeT } from 'livepeer/dist/models/components';
import { GetStreamResponse } from 'livepeer/dist/models/operations';
import Image from 'next/image';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react';

export default function StartComponent() {
  const router = useRouter();
  const { address } = useWeb3ModalAccount();
  const searchParams = useSearchParams();
  const [policy, setPolicy] = useState<TypeT | null>(null);
  const [playbackId, setPlaybackId] = useState<string | null>(null);
  const { open } = useWeb3Modal();

  const id = searchParams.get('id');
  const tokenAddress = searchParams.get('tokenAddress');

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

      return res;
    } catch (error) {
      console.log('error', error);
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

  const connectHandler = async () => {
    await open();
  };

  return (
    <div className='min-h-[95vh] bg-[#272727] flex justify-center items-center font-Grotesk'>
      <div className='bg-[#111111] py-8 px-6 rounded-md  w-[500px]'>
        <Image
          src={'/verify.png'}
          height={250}
          width={250}
          alt='Verify now'
          className='mx-auto'
        />

        <p className='text-center mt-8 font-semibold text-2xl'>
          Verify yourself!
        </p>
        <p className='text-sm text-center text-[#707070] mt-1'>
          Please verify your wallet address here.
        </p>

        <button
          onClick={!address ? connectHandler : streamHandler}
          className='bg-white text-black w-full py-2 text-center rounded-md mt-6'>
          {!address ? 'Connect Wallet' : 'Verify'}
        </button>
      </div>
    </div>
  );
}
