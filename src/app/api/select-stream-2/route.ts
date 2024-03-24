import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data: any = await req.json();
  const buttonId = data.untrustedData.buttonIndex;

  if (buttonId === 1) {
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Add NFT/Erc20 token address</title>
          <meta property="fc:frame" content="vNext"/>
          <meta property="fc:frame:image" content="https://i.postimg.cc/SKBTgvzp/Vemoir-1.png" />
          <meta property="fc:frame:input:text" content="Token address"/>
          <meta property="fc:frame:button:1" content="Next" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/stream-name"/>
      </head>
      </html>
    `);
  } else {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/stream-name`
    );
  }
}

export const dynamic = "force-dynamic";
