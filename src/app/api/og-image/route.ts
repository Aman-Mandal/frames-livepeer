import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
// import svgToImg from "svg-to-img";
import fs from "fs";
import path from "path";
import pinataSDK from "@pinata/sdk";
import { client } from "@/app/lib/db";

export async function POST(req: NextRequest, res: NextApiResponse) {
  const params = req.nextUrl.searchParams;
  console.log("xxx", params);

  const pinata = new pinataSDK(
    process.env.NEXT_PUBLIC_PINATA_API_KEY,
    process.env.NEXT_PUBLIC_PINATA_API_SECRET
  );

  const streamId = await client.get("id");
  const streamKey = await client.get("streamKey");

  console.log("ss", streamId, streamKey);

  const p = path.join(__dirname, "data.svg");
  // Generate SVG content
  const svgContent = `<svg width="800" height="418" xmlns="http://www.w3.org/2000/svg" version="1.1">
      <rect width="100%" height="100%" fill="black" />      
      <text x="20" y="150" font-family="Arial" font-size="20" fill="white">id: ${streamId}</text>
      <text x="20" y="100" font-family="Arial" font-size="20" fill="white">stream key: ${streamKey}</text>
      <text x="20" y="100" font-family="Arial" font-size="20" fill="white">server: srt://rtmp.livepeer.com:2935?streamid=${streamKey}</text>
      </svg>`;

  fs.writeFile(p, svgContent, (err) => {
    console.log(err);
  });

  try {
    const response = await pinata.pinFromFS(p);

    console.log("hash", response.IpfsHash);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
