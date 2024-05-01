import { API } from "@/constants";
import { REAVALIDAION_TIME } from "./contants";

export const getOrganization = async (id: string, token: string) => {
  try {
   
    const res = await fetch(API + "organization/" + id, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: REAVALIDAION_TIME.ORGANIZATION.TIME,
        tags: REAVALIDAION_TIME.ORGANIZATION.TAGS(id),
      },
    });
    const data = await res.json();

    return data;
  } catch (error: any) {
    console.log("Error: ", error.message);
    return { error: "Faled to fetch ORGANIZATION data" };
  }
};
