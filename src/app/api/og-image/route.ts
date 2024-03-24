import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
// import svgToImg from "svg-to-img";
import fs from "fs";
import path from "path";
import pinataSDK from "@pinata/sdk";
import { client } from "@/app/lib/db";

export async function POST(req: NextRequest, res: NextApiResponse): Promise<NextResponse> {
  const params = req.nextUrl.searchParams;

  const pinata = new pinataSDK(
    process.env.NEXT_PUBLIC_PINATA_API_KEY,
    process.env.NEXT_PUBLIC_PINATA_API_SECRET
  );

  const streamId = await client.get("id");
  const streamKey = await client.get("streamKey");


  const p = path.join(__dirname, "data.svg");
  // Generate SVG content
  const svgContent = `<svg width="800" height="418" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <rect width="100%" height="100%" fill="black" />      
  <text x="20" y="150" font-family="Arial" font-size="20" fill="white">id: ${streamId}</text>
  <text x="20" y="100" font-family="Arial" font-size="20" fill="white">stream key: ${streamKey}</text>
  <text x="20" y="200" font-family="Arial" font-size="20" fill="white">server: srt://rtmp.livepeer.com:2935?streamid=${streamKey}</text>
  </svg>`;

  fs.writeFile(p, svgContent, (err) => {
    console.log(err);
  });

    const response = await pinata.pinFromFS(p);

  return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Create stream, watch live or view analytics</title>
          <meta property="fc:frame" content="vNext"/>
          <meta property="fc:frame:image" content="https://beige-emotional-dragon-806.mypinata.cloud/ipfs/${response.IpfsHash}" />
          <meta />
          <meta property="fc:frame:button:1" content="Watch stream" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/stream-api-key"/>
      </head>
      </html>
`)}
