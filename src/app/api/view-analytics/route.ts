import { Livepeer } from "livepeer";
import { NextRequest, NextResponse } from "next/server";
import pinataSDK from "@pinata/sdk";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();
  const inputText = data.untrustedData.inputText;

  const bearerToken = inputText.split(", ")[0];
  //* stream id
  const id = inputText.split(", ")[1];

  const livepeer = new Livepeer({
    apiKey: bearerToken,
  });

  const response = await livepeer.stream.get(id);
  const str = String.fromCharCode.apply(String, response.rawResponse?.data);
  const obj = JSON.parse(str);

  const pinata = new pinataSDK(
    process.env.NEXT_PUBLIC_PINATA_API_KEY,
    process.env.NEXT_PUBLIC_PINATA_API_SECRET
  );

  const svgContent = `<svg width="800" height="418" xmlns="http://www.w3.org/2000/svg" version="1.1">
      <rect width="100%" height="100%" fill="black" />      
      <text x="20" y="100" font-family="Arial" font-size="20" fill="white">name: ${
        obj.name
      }</text>
      <text x="20" y="150" font-family="Arial" font-size="20" fill="white">stream key: ${
        obj.streamKey
      }</text>
      <text x="20" y="200" font-family="Arial" font-size="20" fill="white">playback id: ${
        obj.playbackId
      }</text>
      <text x="20" y="250" font-family="Arial" font-size="20" fill="white">isHealthy: ${
        !obj.isHealthy ? false : obj.isHealthy
      }</text>
      <text x="20" y="300" font-family="Arial" font-size="20" fill="white">isActive: ${
        obj.isActive
      }</text>
      </svg>`;

  const p = path.join(__dirname, "analytics.png");

  const pngData = await sharp(Buffer.from(svgContent)).png().toBuffer();

  await sharp(pngData).toFile(p);

  const resp = await pinata.pinFromFS(p);

  return new NextResponse(`   
  <!DOCTYPE html>
      <html>
        <head>
        <title>Analytics of stream</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://beige-emotional-dragon-806.mypinata.cloud/ipfs/${resp.IpfsHash}"/>
          <meta property="fc:frame:button:1" content="Done" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/home"/>
          </head>
      </html>
  `);
}

export const dynamic = "force-dynamic";
