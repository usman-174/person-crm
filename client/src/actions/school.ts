import { API } from "@/constants";
import { REAVALIDAION_TIME } from "./contants";

export const getSchool = async (id: string, token: string) => {
  try {
   
    const res = await fetch(API + "school/" + id, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: REAVALIDAION_TIME.SCHOOL.TIME,
        tags: REAVALIDAION_TIME.SCHOOL.TAGS(id),
      },
    });
    const data = await res.json();

    return data;
  } catch (error: any) {
    console.log("Error: ", error.message);
    return { error: "Faled to fetch School data" };
  }
};
