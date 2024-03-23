import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data: any = await req.json();
  const buttonId = data.untrustedData.buttonIndex;

  if (buttonId === 1) {
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Create stream</title>
          <meta property="fc:frame" content="vNext"/>
          <meta property="fc:frame:image" content="https://i.postimg.cc/k5ZNCYJD/title.png" />
          <meta property="fc:frame:input:text" content="Stream title"/>
          <meta property="fc:frame:button:1" content="Next" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/stream-api-key"/>
      </head>
      </html>
    `);
  } else if (buttonId === 2) {
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Watch live stream</title>
          <meta property="fc:frame" content="vNext"/>
          <meta property="fc:frame:image" content="https://i.imgur.com/yErFr19.jpeg" />
          <meta property="fc:frame:input:text" content="Stream live link"/>
          <meta property="fc:frame:button:1" content="Next" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/stream-live-video"/>
      </head>
      </html>
    `);
  } else {
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Analytics of stream</title>
          <meta property="fc:frame" content="vNext"/>
          <meta property="fc:frame:image" content="https://i.imgur.com/yErFr19.jpeg" />
          <meta property="fc:frame:input:text" content="Enter stream link"/>
          <meta property="fc:frame:button:1" content="Next" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/view-analytics"/>
      </head>
      </html>
    `);
  }
}

export const dynamic = "force-dynamic";
