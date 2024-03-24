import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();
  const inputText = data.untrustedData.inputText;
  console.log("input", inputText);  // @fetch stream key and show below

  return new NextResponse(`   
  <!DOCTYPE html>
      <html>
        <head>
        <title>Watch live stream here</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:video" content="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8/"/>
          <meta property="fc:frame:video:type" content=".m3u8"/>
          <meta property="fc:frame:button:1" content="Close" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/home"/>
          </head>
      </html>
  `);
}

export const dynamic = "force-dynamic";
