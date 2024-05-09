import { API } from "@/constants";
import { QUERY_KEYS, REAVALIDAION_TIME } from "./contants";
import { unstable_cache as cache } from "next/cache";

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

// export const getAllIncidents = async (token: string) => {
//   try {
//     const res = await fetch(API + REAVALIDAION_TIME.INCIDENT.type, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       next: {
//         revalidate: REAVALIDAION_TIME.INCIDENT.TIME,
//         tags: [QUERY_KEYS.ALL_INCIDENTS],
//       },
//     });
//     const data = await res.json();

//     return data;
//   } catch (error: any) {
//     console.log("Error: ", error.message);
//     return { error: "Failed to fetch Incident data" };
//   }
// };
