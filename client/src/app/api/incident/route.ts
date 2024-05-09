import prisma from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      include: {
        createdBy: true,
        lastModifiedBy: true,
        organizations: true,
        persons: true,
        schools: true,
      },
      orderBy: { createdAt: "desc" }, // Sort by createdAt in descending order
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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const { personIds, schoolIds, organizationIds, ...rest } = await req.json();

    const incident = await prisma.incident.create({
      data: {
        ...rest,
        ...(personIds?.length
          ? { persons: { connect: personIds.map((id: string) => ({ id })) } }
          : {}),
        ...(schoolIds?.length
          ? { schools: { connect: schoolIds.map((id: string) => ({ id })) } }
          : {}),
        ...(organizationIds?.length
          ? {
              organizations: {
                connect: organizationIds.map((id: string) => ({ id })),
              },
            }
          : {}),
        createdBy: { connect: { id: session?.user?.id } },
        lastModifiedBy: { connect: { id: session?.user?.id } },
      },
    });

    return new Response(JSON.stringify(incident), {
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
