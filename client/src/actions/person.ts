import prisma from "@/lib/prisma";
import { PERSON } from "@/types/COMMON";
import { unstable_cache as cache, unstable_noStore } from "next/cache";
import { QUERY_KEYS, REAVALIDAION_TIME } from "./contants";

export const getPerson = async (id: string): Promise<PERSON | any> => {
  return await cache(
    async () => {
      try {
        const person = await prisma.person.findUnique({
          where: { id: String(id) },
          include: {
            social: true,
            createdBy: true,
            lastModifiedBy: true,
            incidents: { orderBy: { createdAt: "desc" } },
          },
        });
        const images = await prisma.image.findMany({
          where: {
            personId: id,
          },
          orderBy: {
            primary: "desc",
          },
        });
        //delete passwords
        if (person?.createdBy?.password) {
          person.createdBy.password = null;
        }
        if (person?.lastModifiedBy?.password) {
          person.lastModifiedBy.password = null;
        }
        return { ...person, images };
      } catch (error: any) {
        console.log("Error: ", error.message);
        return { error: "Failed to fetch Person data" };
      }
    },
    REAVALIDAION_TIME.PERSON.TAGS(id),
    {
      revalidate: 400,
      tags: REAVALIDAION_TIME.PERSON.TAGS(id),
    }
  )();
};

export const getAllPersons = async (): Promise<PERSON[] | any> => {
  return await cache(
    async () => {
      try {
        console.log("Fetching all persons");

        const res = await prisma.person.findMany({
          include: {
            social: true,
            organizations: true,
            schools: true,
            images: true,
            incidents: { orderBy: { createdAt: "desc" } },
          },
        });

        return res;
      } catch (error: any) {
        console.log("Error: ", error.message);
        return { error: "Failed to fetch Person data" };
      }
    },
    [QUERY_KEYS.ALL_PERSONS],
    {
      revalidate: 400,
      tags: [QUERY_KEYS.ALL_PERSONS],
    }
  )();
};

export async function getAllPersonCities() {
  unstable_noStore();
  return await cache(
    async () => {
      try {
        const cities = await prisma.person.findMany({
          distinct: ["city"],
          select: {
            city: true,
          },
        });

        return cities.map((person) => person.city).filter(Boolean);
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
export async function getAllPersonStates() {
  unstable_noStore();
  return await cache(
    async () => {
      try {
        const states = await prisma.person.findMany({
          distinct: ["state"],
          select: {
            state: true,
          },
        });

        return states.map((person) => person.state).filter(Boolean);
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
