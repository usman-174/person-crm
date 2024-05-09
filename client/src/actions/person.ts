import prisma from "@/lib/prisma";
import { PERSON } from "@/types/COMMON";
import { unstable_cache as cache } from "next/cache";
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
          },
        });

        return person;
      } catch (error: any) {
        console.log("Error: ", error.message);
        return { error: "Failed to fetch user data" };
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
            incidents: { orderBy: { createdAt: "desc" } },
          },
        });

        return res;
      } catch (error: any) {
        console.log("Error: ", error.message);
        return { error: "Failed to fetch user data" };
      }
    },
    [QUERY_KEYS.ALL_PERSONS],
    {
      revalidate: 400,
      tags: [QUERY_KEYS.ALL_PERSONS],
    }
  )();
};
