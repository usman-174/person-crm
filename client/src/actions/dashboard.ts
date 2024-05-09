import { API } from "@/constants";
import { QUERY_KEYS, REAVALIDAION_TIME } from "./contants";
import { unstable_cache as cache } from "next/cache";

import prisma from "@/lib/prisma";
export const getCount = async (): Promise<any> => {
  return await cache(
    async () => {
      try {
        const personCount = await prisma.person.count();

        const schoolCount = await prisma.school.count();
        const organizationCount = await prisma.organization.count();
        const incidentCount = await prisma.incident.count();

        return {
          personCount,
          schoolCount,
          organizationCount,
          incidentCount,
        };
      } catch (error) {
        console.log(error);
        return { error: "Internal Server Error" };
      }
    },
    [QUERY_KEYS.ALL_COUNT],
    {
      revalidate: 400,
      tags: [QUERY_KEYS.ALL_COUNT],
    }
  )();
};
