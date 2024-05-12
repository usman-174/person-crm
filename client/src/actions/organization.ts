import prisma from "@/lib/prisma";
import { unstable_cache as cache, unstable_noStore } from "next/cache";
import { REAVALIDAION_TIME } from "./contants";
import { ORGANIZATION } from "@/types/COMMON";

export const getOrganization = async (
  id: string
): Promise<ORGANIZATION | any> => {
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
        const images = await prisma.image.findMany({
          where: {
            organizationId: id,
          },
          orderBy: {
            primary: "desc",
          },
        });
        //delete passwords
        if (organization?.createdBy?.password) {
          organization.createdBy.password = null;
        }
        if (organization?.lastModifiedBy?.password) {
          organization.lastModifiedBy.password = null;
        }

        return { ...organization, images };
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

export async function getAllOrganizationCities() {
  unstable_noStore();
  return await cache(
    async () => {
      try {
        const cities = await prisma.organization.findMany({
          distinct: ["city"],
          select: {
            city: true,
          },
        });

        return cities.map((organization) => organization.city).filter(Boolean);
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
export async function getAllOrganizationStates() {
  unstable_noStore();
  return await cache(
    async () => {
      try {
        const states = await prisma.organization.findMany({
          distinct: ["state"],
          select: {
            state: true,
          },
        });

        return states.map((organization) => organization.state).filter(Boolean);
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
