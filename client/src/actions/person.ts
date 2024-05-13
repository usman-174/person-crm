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
