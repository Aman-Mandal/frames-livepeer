import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();
  const inputText = data.untrustedData.inputText;

  return new NextResponse(`   
  <!DOCTYPE html>
      <html>
        <head>
        <title>Watch live stream here</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://i.postimg.cc/XJwZTQQ5/Vemoir-4.png"/>
          <meta property="fc:frame:button:1" content="View stream here" />
          <meta property="fc:frame:button:1:action" content="link"/>
          <meta property="fc:frame:button:1:target" content="${process.env.NEXT_PUBLIC_BASE_URL}/start?id=${inputText}"/>
          </head>
      </html>
  `);
}

export const dynamic = "force-dynamic";
