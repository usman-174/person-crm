import prisma from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const { headIds, organizationId, ...rest } = await req.json();

    const person = await prisma.person.create({
      data: {
        ...rest,

        createdBy: { connect: { id: session?.user?.id } },
        lastModifiedBy: { connect: { id: session?.user?.id } },
      },
    });

    return new Response(JSON.stringify(person), {
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
