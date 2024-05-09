import prisma from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      include: {
        heads: true,
        organization: true,
        createdBy: true,
        lastModifiedBy: true,
      },
    });

    return new Response(JSON.stringify(schools), {
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

    const school = await prisma.school.create({
      data: {
        ...rest,
        ...(headIds?.length
          ? { heads: { connect: headIds.map((id: string) => ({ id })) } }
          : {}),
        ...(organizationId
          ? { organization: { connect: { id: organizationId } } }
          : {}),
        createdBy: { connect: { id: session?.user?.id } },
        lastModifiedBy: { connect: { id: session?.user?.id } },
      },
    });

    return new Response(JSON.stringify(school), {
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
