import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../../db";
import jwt from "jsonwebtoken";

// Controller for user registration

type registerBody = {
  username: string;
  password: string;
  fName: string;
  mName: string;
  lName: string;
  address: string;
};

export const registerController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { username, password, fName, mName, lName, address }: registerBody =
    req.body;
  try {
    if (!username || !password || !fName || !lName) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    // Check if the username is an email
    if (!username.includes("@")) {
      return res.status(400).json({ message: "Invalid Email" });
    }
    // Check if the user already exists
    const userExist = await prisma.user.findUnique({ where: { username } });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password
    let pass = bcrypt.hashSync(password, 10);
    // Create the user
    const user = await prisma.user.create({
      data: {
        username,
        password: pass,
        fname: fName,
        ...(mName ? { mname: mName } : {}), // Simplified middle name assignment (if it exists
        lname: lName,

        ...((address ? { address } : {}) as any), // Simplified address assignment
      },
    });
    // Generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET! || "secret",
      {
        expiresIn: "7d",
      }
    );
    return res.status(201).json({ token });
  } catch (error) {
    console.log(error);
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Username already exists" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

type LoginBody = {
  username: string;
  password: string;
};
export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password }: LoginBody = req.body;
  try {
    if (!username || !password) {
      res
        .status(400)
        .json({ message: "Please provide both username and password" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password!);
    if (!passwordMatch) {
      res.status(401).json({ message: "Incorrect password" });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret",{
      expiresIn: "7d",
    
    });
    if (user.password) {
      delete (user as { password?: string }).password;
    }
    res.status(200).json({ user, token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMe = async (_: Request, res: Response): Promise<void> => {
  delete res.locals.user.password;
  res.status(200).json(res.locals.user);
};
