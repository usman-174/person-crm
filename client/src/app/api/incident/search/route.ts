import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url).searchParams;
  const query = url.get("query");


  try {
    const incidents = await prisma.incident.findMany({
      where: {
        OR: [
          { location: { contains: String(query) } },
          { type: { contains: String(query) } },
          { notes: { contains: String(query) } },
          { time: { contains: String(query) } },
          {title: {contains: String(query)}},

          // Add more fields as needed
        ],
      },
      include: {
        createdBy: true,
        lastModifiedBy: true,
        organizations: true,
        persons: true,
        schools: true,
      },
    });

    return new Response(JSON.stringify(incidents), {
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
