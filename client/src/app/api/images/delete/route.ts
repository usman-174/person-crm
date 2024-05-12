import { cloudinary } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
export async function POST(req: NextRequest) {
    try {
      const { image } = await req.json();
   
      
      if (!image.public_id) {
        throw new Error("Missing required fields");
      }
      await cloudinary.v2.uploader.destroy(image.public_id?.split("/")[1], {
        resource_type: "image",
      });
      const deletedImage = await prisma.image.delete({
        where: {
          id: image.id,
        },
      });
   
  
      const type = deletedImage.schoolId
        ? "school"
        : deletedImage.organizationId
        ? "organization"
        : deletedImage.personId
        ? "person"
        : "incident";
      
  
      const type2 = deletedImage.schoolId
        ? "schoolId"
        : deletedImage.organizationId
        ? "organizationId"
        : deletedImage.personId
        ? "personId"
        : "incidentId";
      console.log("type", type);
  
      if (deletedImage.primary) {
        const image = await prisma.image.findMany({
          where: {
            [type]: { id: deletedImage[type2]! },
          },
          orderBy: {
            createdAt: "asc",
          },
        });
        if (image.length > 0) {
          await prisma.image.update({
            where: {
              id: image[0].id,
            },
            data: {
              primary: true,
            },
          });
        }
      }
      return new Response(
        JSON.stringify({
          message: "Image deleted successfully",
          deletedImage,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err: any) {
      console.error("error delete image", err.message);
      return new Response(JSON.stringify({ message: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }