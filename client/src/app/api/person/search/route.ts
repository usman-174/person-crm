import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url).searchParams;
  const query = url.get("query");

  try {
    const persons = await prisma.person.findMany({
      where: {
        OR: [
          { username: { contains: query as string } },
          { TFF_ID: { contains: query as string } },
          { fname: { contains: query as string } },
          { mname: { contains: query as string } },
          { lname: { contains: query as string } },
          { address: { contains: query as string } },
          { address2: { contains: query as string } },
          { city: { contains: query as string } },
          { state: { contains: query as string } },
          { country: { contains: query as string } },
          // { role: { contains: query as string } },
          { title: { contains: query as string } },
          { notes: { contains: query as string } },
          // Add more fields as needed
        ],
      },
      // include: { social: true },
    });

    return new Response(JSON.stringify(persons), {
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
