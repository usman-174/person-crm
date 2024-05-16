import prisma from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const users = await prisma.person.findMany({
      // include: { social: true, organizations:true, incidents: { orderBy: { createdAt: "desc" } } },
      include: { social: true, organizations: true, incidents: true },

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

    const { headIds, organizationId, username, ...rest } = await req.json();

    //check already exists
    const existingPerson = await prisma.person.findFirst({
      where: { username: username },
    });

    if (existingPerson) {
      return new Response(
        JSON.stringify({ message: "Person already exists with same Email" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    console.log({
      ...rest,
      username,
      createdBy: { connect: { id: session?.user?.id } },
      lastModifiedBy: { connect: { id: session?.user?.id } },
    });

    const person = await prisma.person.create({
      data: {
        ...rest,
        username,
        createdBy: { connect: { id: session?.user?.id } },
        lastModifiedBy: { connect: { id: session?.user?.id } },
      },
    });

    return new Response(JSON.stringify(person), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("add person", err.message);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
