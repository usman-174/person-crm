import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request:NextRequest) {
  try {
    const body = await request.json();
    const path = body?.path;
    const tags = body?.tags;

    if (tags?.length) {
      for (const tag of tags) {
        console.log("Revalidating tag", tag);
        revalidateTag(tag);
      }
    
    }
    if (path) {
      revalidatePath(path);
      return new Response(JSON.stringify({ message: `Revalidated ${path}` }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } 
    return new Response(
      JSON.stringify({ message: "Revalidated!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: "Error revalidating path" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}