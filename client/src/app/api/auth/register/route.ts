import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      throw new Error("Please provide all required fields");
    }

    if (!username.includes("@")) {
      throw new Error("Invalid Email");
    }
    const userExist = await prisma.user.findUnique({ where: { username } });
    if (userExist) {
      throw new Error("User already exists");
    }
    let pass = bcrypt.hashSync(password, 10);
    await prisma.user.create({
      data: {
        username,
        password: pass,
      },
    });

    return new Response(
      JSON.stringify({ message: "Registered Successfully " }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: err.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
