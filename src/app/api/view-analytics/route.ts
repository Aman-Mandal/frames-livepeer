import { Livepeer } from "livepeer";
import { GetCreatorMetricsRequest, QueryParamBreakdownBy, QueryParamTimeStep } from "livepeer/dist/models/operations";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();
  const inputText = data.untrustedData.inputText;
  console.log("input", inputText);  // @fetch stream key and show below

  const livepeer = new Livepeer({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_KEY,
  });
 
  const response = await livepeer.metrics.getPublicTotalViews(inputText)
  const str = String.fromCharCode.apply(String, response.rawResponse?.data);
  const obj = JSON.parse(str);
  console.log("xxx", obj) // @Vaibhav dynamic og image to show on screen

  return new NextResponse(`   
  <!DOCTYPE html>
      <html>
        <head>
        <title>Analytics of stream</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://i.imgur.com/aC65jWk.jpeg"/>
          <meta property="fc:frame:button:1" content="Done" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/home"/>
          </head>
      </html>
  `);
}

export const dynamic = "force-dynamic";
