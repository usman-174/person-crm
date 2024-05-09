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
    const { social, ...rest } = await req.json();
    
    const person = await prisma.person.update({
      where: { id: String(id) },
      data: {
        ...rest,

        lastModifiedBy: { connect: { id: session?.user?.id } },
      },
    });
    for (const record of social) {
      await prisma.social.update({
        where: {
          id: record.id,
        },
        data: {
          account: record.account,
          platform: record.platform,
        },
      });
    }
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

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.person.delete({ where: { id: String(id) } });

    return new Response(JSON.stringify({ messahe: "Person Deleted" }), {
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
