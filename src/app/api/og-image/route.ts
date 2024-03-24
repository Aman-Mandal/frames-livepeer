import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import svgToImg from "svg-to-img";
import fs from "fs"
import path from "path"

export async function GET(req: NextRequest, res: NextApiResponse) {
    const params = req.nextUrl.searchParams
    console.log("xxx", params)

    // Generate SVG content
    const svgContent = `
      <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <style>
          .title { font: bold 48px sans-serif; fill: #333; }
          /* Add more styles here */
        </style>
        <rect width="100%" height="100%" fill="#f0f0f0"></rect>
        <text x="50%" y="50%" class="title" dominant-baseline="middle" text-anchor="middle">Hello</text>
      </svg>
    `;
  
    try {
      const image = await svgToImg.from(svgContent).toPng();

      console.log("xxx", image)

    fs.writeFile("/public", image, (data) => {
        console.log(data)
    })
  
      // Set Content-Type header and send the image
      res.setHeader("Content-Type", "image/png");
      res.send(image);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
