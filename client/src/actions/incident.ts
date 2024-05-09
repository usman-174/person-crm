import { unstable_cache as cache } from "next/cache";
import { REAVALIDAION_TIME } from "./contants";

import prisma from "@/lib/prisma";

export const getIncident = async (id: string):Promise<any> => {
  return await cache(
    async () => {
      try {
        const incidents = await prisma.incident.findUnique({
          where: { id: String(id) },
          include: {
            createdBy: true,
            lastModifiedBy: true,
            organizations: true,
            persons: true,
            schools: true,
          },
        });
        //delete passwords
        if (incidents?.createdBy?.password) {
          incidents.createdBy.password = null;
        }
        if (incidents?.lastModifiedBy?.password) {
          incidents.lastModifiedBy.password = null;
        }

        return incidents;
      } catch (error: any) {
        console.log("Error: ", error.message);
        return { error: "Failed to fetch Incident data" };
      }
    },
    REAVALIDAION_TIME.INCIDENT.TAGS(id),
    {
      revalidate: 400,
      tags: REAVALIDAION_TIME.INCIDENT.TAGS(id),
    }
  )();
};
