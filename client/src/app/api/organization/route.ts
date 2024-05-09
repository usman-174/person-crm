import prisma from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    console.log("Got request");

    const organizations = await prisma.organization.findMany({
      include: {
        heads: true,
        schools: true,
        createdBy: true,
        lastModifiedBy: true,
      },
      orderBy:{
        createdAt: 'desc'
      }
    });

    return new Response(JSON.stringify(organizations), {
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

    const { headIds, ...rest } = await req.json();

    const organization = await prisma.organization.create({
      data: {
        ...rest,
        ...(headIds?.length
          ? { heads: { connect: headIds.map((id: string) => ({ id })) } }
          : {}),
        createdBy: { connect: { id: session?.user?.id } },
        lastModifiedBy: { connect: { id: session?.user?.id } },
      },
      
    });

    return new Response(JSON.stringify(organization), {
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
