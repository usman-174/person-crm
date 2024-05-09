import prisma from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";

import { getServerSession } from "next-auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    const { headIds, organizationId, ...rest } = await req.json();

    const school = await prisma.school.update({
      where: { id: String(id) },
      data: {
        ...rest,
        ...(headIds.length
          ? { heads: { set: headIds.map((id: string) => ({ id })) } }
          : {}),
        ...(organizationId
          ? { organization: { connect: { id: organizationId } } }
          : {}),
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

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.school.delete({ where: { id: String(id) } });

    return new Response(JSON.stringify({ messahe: "School Deleted" }), {
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
