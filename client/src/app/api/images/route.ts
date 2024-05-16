import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { type, typeId, images } = await req.json();

    if (
      !type ||
      !typeId ||
      !images ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      throw new Error("Missing required fields");
    }

    // Check if type ID exists
    let record;
    if (type === "school") {
      record = await prisma.school.findUnique({ where: { id: typeId } });
    } else if (type === "organization") {
      record = await prisma.organization.findUnique({ where: { id: typeId } });
    } else if (type === "person") {
      // type === 'person'
      record = await prisma.person.findUnique({ where: { id: typeId } });
    } else {
      record = await prisma.incident.findUnique({ where: { id: typeId } });
    }
    if (!record) {
      throw new Error("Record not found");
    }

    // Create images
    const createdImages = [];
    //primary image exists in db or not
    const primaryImage = await prisma.image.findFirst({
      where: {
        [type]: { id: typeId },
        primary: true,
      },
    }); 

    for (let index = 0; index < images.length; index++) {
      const element = images[index];
      const createdImage = await prisma.image.create({
        data: {
          url: element.url,
          public_id: element.public_id,
          primary: primaryImage ? false : index === 0 ? true : false,
          [type]: {
            connect: { id: typeId },
          },
        },
      });
      createdImages.push(createdImage);
    }
    return new Response(JSON.stringify(createdImages), {
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



export async function PUT(req: NextRequest) {
  try {
    const { image } = await req.json();

    //make image primary and other non primary

    const type = image.schoolId
      ? "school"
      : image.organizationId
      ? "organization"
      : image.personId
      ? "person"
      : "incident";

    const images = await prisma.image.findMany({
      where: {
        [type]: { id: image[type + "Id"] },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    for (let index = 0; index < images.length; index++) {
      const element = images[index];
      if (element.id === image.id) {
        await prisma.image.update({
          where: {
            id: element.id,
          },
          data: {
            primary: true,
          },
        });
      } else {
        await prisma.image.update({
          where: {
            id: element.id,
          },
          data: {
            primary: false,
          },
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: "Image changed successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
