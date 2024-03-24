import { getFrameMetadata } from "@coinbase/onchainkit";
import type { Metadata } from "next";

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: "Get started",
    },
  ],
  image: `https://i.postimg.cc/pdH1H7yk/home.png`,
  postUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/home`,
});

export const metadata: Metadata = {
  title: "Livecaster",
  description: "Start streaming without any configuration!",
  openGraph: {
    title: "StreamX - Start live streaming now",
    description: "Start streaming without any configuration!",
    images: [`https://i.imgur.com/SDUac0Z.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>Livecaster</h1>
    </>
  );
}
