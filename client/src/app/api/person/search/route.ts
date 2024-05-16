import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url).searchParams;
  const query = url.get("query");
  const sort = url.get("sort");
  const city = url.get("city");
  const state = url.get("state");

  let orderBy = {};
  if (sort?.length) {
    orderBy = {
      [sort.split("-")[0]]: sort.split("-")[1],
    };
  }

  try {
    const persons = await prisma.person.findMany({
      where: {
        ...(query
          ? {
              OR: [
                {
                  username: { contains: query as string, mode: "insensitive" },
                },
                { TFF_ID: { contains: query as string, mode: "insensitive" } },
                { fname: { contains: query as string, mode: "insensitive" } },
                { mname: { contains: query as string, mode: "insensitive" } },
                { lname: { contains: query as string, mode: "insensitive" } },
                { address: { contains: query as string, mode: "insensitive" } },
                {
                  address2: { contains: query as string, mode: "insensitive" },
                },
                { city: { contains: query as string, mode: "insensitive" } },
                { state: { contains: query as string, mode: "insensitive" } },
                { country: { contains: query as string, mode: "insensitive" } },
                // { role: { contains: query as string, mode: "insensitive" } },
                { title: { contains: query as string, mode: "insensitive" } },
                { notes: { contains: query as string, mode: "insensitive" } },
                // Add more fields as needed
              ],
            }
          : {}),
        ...(city
          ? { city: { contains: city as string, mode: "insensitive" } }
          : {}),
        ...(state
          ? { state: { contains: state as string, mode: "insensitive" } }
          : {}),
      },

      orderBy,
      include: {
        social: true,
        organizations: true,
        incidents: true,
        images: {
          orderBy: {
            primary: "desc",
          },
        },
      },
    });

    return new Response(JSON.stringify(persons), {
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
