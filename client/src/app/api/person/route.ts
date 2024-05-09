import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    console.log("Got request perons");

    const users = await prisma.person.findMany({
      include: { social: true, incidents: { orderBy: { createdAt: "desc" } } },
      // orderBy: {  incidents: { createdAt: "desc" }},
    });

    return new Response(JSON.stringify(users), {
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
