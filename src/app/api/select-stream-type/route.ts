import { NextRequest, NextResponse } from "next/server";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  return new NextResponse(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Select type of stream</title>
                <meta property="fc:frame" content="vNext"/>
                <meta property="fc:frame:image" content="https://i.postimg.cc/JzfWSmfF/started.png" />
                <meta />
                <meta property="fc:frame:button:1" content="Tokengated Stream?" />
                <meta property="fc:frame:button:2" content="Normal Stream"/>
                <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/select-stream-2"/>
            </head>
            </html>
        `);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
