import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();
  const inputText = data.untrustedData.inputText;
  console.log("input", inputText);  // @fetch stream key and show below

  return new NextResponse(`   
  <!DOCTYPE html>
      <html>
        <head>
        <title>Token symbol</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://i.imgur.com/aC65jWk.jpeg"/>
          <meta property="fc:frame:button:1" content="Go live" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/go-live"/>
          </head>
      </html>
  `);
}

export const dynamic = "force-dynamic";
