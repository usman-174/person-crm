import prisma from "@/lib/prisma";
import { SCHOOL } from "@/types/COMMON";
import { unstable_cache as cache, unstable_noStore } from "next/cache";
import { REAVALIDAION_TIME } from "./contants";

export const getSchool = async (id: string): Promise<SCHOOL | any> => {
  return await cache(
    async () => {
      try {
        const school = await prisma.school.findUnique({
          where: { id: String(id) },

          include: {
            createdBy: true,
            lastModifiedBy: true,
            heads: true,
            organization: true,
          },
        });
        const images = await prisma.image.findMany({
          where: {
            schoolId: id,
          },
          orderBy: {
            primary: "desc",
          },
        });
        //delete passwords
        if (school?.createdBy?.password) {
          school.createdBy.password = null;
        }
        if (school?.lastModifiedBy?.password) {
          school.lastModifiedBy.password = null;
        }
        return { ...school, images };
      } catch (error: any) {
        return { error: "Faled to fetch School data" };
      }
    },
    REAVALIDAION_TIME.SCHOOL.TAGS(id),
    {
      revalidate: 400,
      tags: REAVALIDAION_TIME.SCHOOL.TAGS(id),
    }
  )();
};

export async function getAllSchoolCities() {
  unstable_noStore();
  return await cache(
    async () => {
      try {
        const cities = await prisma.school.findMany({
          distinct: ["city"],
          select: {
            city: true,
          },
        });

        return cities.map((school) => school.city).filter(Boolean);
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
export async function getAllSchoolStates() {
  unstable_noStore();
  return await cache(
    async () => {
      try {
        const states = await prisma.school.findMany({
          distinct: ["state"],
          select: {
            state: true,
          },
        });

        return states.map((school) => school.state).filter(Boolean);
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
