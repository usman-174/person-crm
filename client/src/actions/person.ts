import { API } from "@/constants";
import { REAVALIDAION_TIME } from "./contants";
import { unstable_noStore } from "next/cache";

export const getPerson = async (id: string, token: string) => {
  try {
   
    const res = await fetch(API + "person/" + id, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: REAVALIDAION_TIME.PERSON.TIME,
        tags: REAVALIDAION_TIME.PERSON.TAGS(id),
      },
    });
    const data = await res.json();

    return data;
  } catch (error: any) {
    console.log("Error: ", error.message);
    return { error: "Faled to fetch user data" };
  }
};
