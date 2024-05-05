import { API } from "@/constants";
import { QUERY_KEYS, REAVALIDAION_TIME } from "./contants";

export const getIncident = async (id: string, token: string) => {
  try {
    const res = await fetch(API + REAVALIDAION_TIME.INCIDENT.type + "/" + id, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: REAVALIDAION_TIME.INCIDENT.TIME,
        tags: REAVALIDAION_TIME.INCIDENT.TAGS(id),
      },
    });
    const data = await res.json();

    return data;
  } catch (error: any) {
    console.log("Error: ", error.message);
    return { error: "Failed to fetch Incident data" };
  }
};

export const getAllIncidents = async (token: string) => {
  try {
    const res = await fetch(API + REAVALIDAION_TIME.INCIDENT.type, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: REAVALIDAION_TIME.INCIDENT.TIME,
        tags: [QUERY_KEYS.ALL_INCIDENTS],
      },
    });
    const data = await res.json();

    return data;
  } catch (error: any) {
    console.log("Error: ", error.message);
    return { error: "Failed to fetch Incident data" };
  }
};
