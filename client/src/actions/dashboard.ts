import { API } from "@/constants";
import { REAVALIDAION_TIME } from "./contants";
export const getCount = async (token:string): Promise<any> => {
  try {
    const res = await fetch(API + "all-counts", {
      headers:{
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: {
        revalidate: REAVALIDAION_TIME.COUNT.TIME,
        tags: REAVALIDAION_TIME.COUNT.TAGS,
      },
    });

    const data = await res.json();
    console.log("Data: ", data);
    
    return data;
  } catch (error:any) {
    console.log("Error: ", error.message);
    
    return null;
  }
};
