import prisma from "@/lib/prisma";

export async function DELETE(
    _: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = params;
  
      await prisma.social.delete({ where: { id: String(id) } });
  
      return new Response(JSON.stringify({ messahe: "Social Deleted" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ message: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  