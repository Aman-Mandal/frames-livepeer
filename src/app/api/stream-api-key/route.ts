import { NextRequest, NextResponse } from "next/server";
import { Livepeer } from "livepeer";
import { client } from "@/app/lib/db";
import { TypeT } from "livepeer/dist/models/components";

type TStream = {
  name: string;
  playbackPolicy?: {
    type: TypeT;
  };
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  const test = req.json();

  const token = client.get("tokenAddress");
  const [data, tokenAddress] = await Promise.all([test, token]);

  const inputText = data.untrustedData.inputText;

  const livepeer = new Livepeer({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_KEY,
  });

  const streamData: TStream = {
    name: inputText,
  };

  if (tokenAddress) {
    streamData.playbackPolicy = {
      type: TypeT.Jwt,
    };
  }

  const response = await livepeer.stream.create(streamData);

  const str = String.fromCharCode.apply(String, response.rawResponse?.data);
  const obj = JSON.parse(str);

  //* srt://rtmp.livepeer.com:2935?streamid=${obj.streamKey}

  client.set("id", obj.id);
  client.set("streamKey", obj.streamKey);

  return new NextResponse(`   
  <!DOCTYPE html>
      <html>
        <head>
        <title>Stream api key</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://i.postimg.cc/J4XhgygV/Vemoir-2.png"/>
          <meta property="fc:frame:button:1" content="Go live" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/og-image"/>
          </head>
      </html>
  `);
}

export const dynamic = "force-dynamic";
