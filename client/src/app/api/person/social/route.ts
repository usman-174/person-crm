// export const addSocialPlatform = async (req: Request, res: Response) => {
//     try {

//       res.status(200).json(socialPlatforms);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: constants.INTERNAL_SERVER });
//     }
//   };

import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const socialPlatforms = await prisma.social.create({
      data: body,
    });

    return new Response(JSON.stringify(socialPlatforms), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
