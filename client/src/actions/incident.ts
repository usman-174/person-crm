import { unstable_cache as cache, unstable_noStore } from "next/cache";
import { REAVALIDAION_TIME } from "./contants";

import prisma from "@/lib/prisma";

export const getIncident = async (id: string): Promise<any> => {
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

export async function getAllIncidentCities() {
  unstable_noStore();
  return await cache(
    async () => {
      try {
        const cities = await prisma.incident.findMany({
          distinct: ["city"],
          select: {
            city: true,
          },
        });

        return cities.map((incident) => incident.city).filter(Boolean);
      } catch (error) {
        console.error("Error fetching cities:", error);
        throw error;
      }
    },
    [REAVALIDAION_TIME.CITIES.type],
    {
      revalidate: 200,
      tags: [REAVALIDAION_TIME.CITIES.type],
    }
  )();
}
export async function getAllIncidentStates() {
  unstable_noStore();
  return await cache(
    async () => {
      try {
        const states = await prisma.incident.findMany({
          distinct: ["state"],
          select: {
            state: true,
          },
        });

        return states.map((incident) => incident.state).filter(Boolean);
      } catch (error) {
        console.error("Error fetching states:", error);
        throw error;
      }
    },
    [REAVALIDAION_TIME.STATES.type],
    {
      revalidate: 200,
      tags: [REAVALIDAION_TIME.STATES.type],
    }
  )();
}
