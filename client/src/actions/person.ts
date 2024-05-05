import { API } from "@/constants";
import { QUERY_KEYS, REAVALIDAION_TIME } from "./contants";

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

export const getAllPersons = async () => {
  try {
    const res = await Promise.race([
      fetch(API + "person", {
        next: {
          revalidate: REAVALIDAION_TIME.PERSON.TIME,
          tags: [QUERY_KEYS.ALL_PERSONS],
        },
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
    ]);

    if (res instanceof Response) {
      const data = await res.json();
      return data;
    } else {
      console.log("Timeout exceeded");
      return []; // Return empty array if timeout exceeded
    }
  } catch (error: any) {
    console.log("Error: ", error.message);
    return { error: "Failed to fetch user data" };
  }
};
