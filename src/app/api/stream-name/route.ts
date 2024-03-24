import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();
  const inputText = data.untrustedData.inputText;
  console.log("input", inputText);  // @fetch stream key and show below

  return new NextResponse(`   
  <!DOCTYPE html>
      <html>
        <head>
        <title>Add stream name</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://i.postimg.cc/k5ZNCYJD/title.png" />
          <meta property="fc:frame:input:text" content="Stream name"/>
          <meta property="fc:frame:button:1" content="Next" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/stream-api-key"/>
          </head>
      </html>
  `);
}

export const dynamic = "force-dynamic";
