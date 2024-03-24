import { NextRequest, NextResponse } from "next/server";
import { Livepeer } from "livepeer";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();
  const inputText = data.untrustedData.inputText;
  console.log("input", inputText); // @fetch stream key and show below

  const livepeer = new Livepeer({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_KEY,
  });

  const streamData = {
    name: inputText,
  };

  const response = await livepeer.stream.create(streamData);

  const str = String.fromCharCode.apply(String, response.rawResponse?.data);
  const obj = JSON.parse(str);

  console.log("stream created", obj.streamKey);
  //* srt://rtmp.livepeer.com:2935?streamid=${obj.streamKey}

  const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/og-image?content=Your+Dynamic+Content`;

  return new NextResponse(`   
  <!DOCTYPE html>
      <html>
        <head>
        <title>Stream api key</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${ogImageUrl}"/>
          <meta property="fc:frame:button:1" content="Go live" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/go-live"/>
          </head>
      </html>
  `);
}

export const dynamic = "force-dynamic";
