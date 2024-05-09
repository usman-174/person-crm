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
    const { personIds, schoolIds, organizationIds, ...rest } = await req.json();

    const incident = await prisma.incident.update({
      where: { id: String(id) },
      data: {
        ...rest,
        ...(personIds
          ? { persons: { set: personIds.map((id: string) => ({ id })) } }
          : {}),
        ...(schoolIds
          ? { schools: { set: schoolIds.map((id: string) => ({ id })) } }
          : {}),
        ...(organizationIds
          ? {
              organizations: {
                set: organizationIds.map((id: string) => ({ id })),
              },
            }
          : {}),
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

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.incident.delete({ where: { id: String(id) } });

    return new Response(JSON.stringify({ messahe: "Incident Deleted" }), {
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
