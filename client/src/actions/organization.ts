import prisma from "@/lib/prisma";
import { unstable_cache as cache } from "next/cache";
import { REAVALIDAION_TIME } from "./contants";
import { ORGANIZATION } from "@/types/COMMON";

export const getOrganization = async (id: string):Promise<ORGANIZATION | any> => {
  return await cache(
    async () => {
      try {
        const organization = await prisma.organization.findUnique({
          where: { id: String(id) },
          include: {
            createdBy: true,
            lastModifiedBy: true,
            heads: true,
            schools: true,
          },
        });
        //delete passwords
        if (organization?.createdBy?.password) {
          organization.createdBy.password = null;
        }
        if (organization?.lastModifiedBy?.password) {
          organization.lastModifiedBy.password = null;
        }

        return organization;
      } catch (error: any) {
        console.log("Error: ", error.message);
        return { error: "Faled to fetch ORGANIZATION data" };
      }
    },
    REAVALIDAION_TIME.ORGANIZATION.TAGS(id),
    {
      revalidate: 400,
      tags: REAVALIDAION_TIME.ORGANIZATION.TAGS(id),
    }
  )();
};
