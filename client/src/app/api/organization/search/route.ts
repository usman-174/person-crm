import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url).searchParams;
  const query = url.get("query");
  const sort = url.get("sort");
  let orderBy = {};
  if (sort?.length) {
    orderBy = {
      [sort.split("-")[0]]: sort.split("-")[1],
    };
  } else {
    orderBy = {
      createdAt: "desc",
    };
  }
  try {
    const schools = await prisma.organization.findMany({
      where: {
        ...(query
          ? {
              OR: [
                { name: { contains: String(query) } },

                { notes: { contains: String(query) } },

                // Add more fields as needed
              ],
            }
          : {}),
      },
      include: {
        heads: true,
        schools: true,
        createdBy: true,
        lastModifiedBy: true,
      },
      orderBy,
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
