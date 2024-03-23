import { NextRequest, NextResponse } from "next/server";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  return new NextResponse(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Create stream, watch live or view analytics</title>
                <meta property="fc:frame" content="vNext"/>
                <meta property="fc:frame:image" content="https://i.imgur.com/aC65jWk.jpeg" />
                <meta />
                <meta property="fc:frame:button:1" content="Create stream" />
                <meta property="fc:frame:button:2" content="Watch live"/>
                <meta property="fc:frame:button:3" content="View analytics"/>
                <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/select"/>
            </head>
            </html>
        `);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
