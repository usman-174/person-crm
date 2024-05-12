import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url).searchParams;
  const query = url.get("query");
  const date = url.get("date") as string;
  const city = url.get("city");
  const state = url.get("state");
  const sort = url.get("sort");
  let orderBy = {};
  if (sort?.length) {
    orderBy = {
      [sort.split("-")[0]]: sort.split("-")[1],
    };
  }

  try {
    const incidents = await prisma.incident.findMany({
      where: {
        ...(query
          ? {
              OR: [
                { location: { contains: String(query) } },
                { type: { contains: String(query) } },
                { notes: { contains: String(query) } },
                { time: { contains: String(query) } },
                { title: { contains: String(query) } },

                // Add more fields as needed
              ],
            }
          : {}),
        ...(date ? { date: { equals: date } } : {}),
        ...(city ? { city: { equals: city } } : {}),
        ...(state ? { state: { equals: state } } : {}),
      },

      include: {
        createdBy: true,
        lastModifiedBy: true,
        organizations: true,
        persons: true,
   
        schools: true,
      },
      orderBy,
    });
    // console.log("Response=>", incidents);

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
function parseDate(dateString: string) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format"); // Throw custom error
  }
  return date;
}
