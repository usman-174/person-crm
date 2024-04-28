import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../db";
interface TokenPayload {
  id: number;
}

export const checkToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No token provided");

    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as TokenPayload;
    const user = await prisma.user.findUnique({
      where: { id: String(decoded.id) },
    });

    if (!user) {
      console.log("User not found");

      return next();
    }

    // Add the user to res.locals for further middleware or route handler access
    res.locals.user = user;
    next();
  } catch (error) {
    console.error("Error:", error);
    return next();
  }
};

export const requireAuth = async (
  _: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!res.locals.user) {
    console.log("Unauthorized");

    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
};

export const allowRoles = (...roles: string[]) => {
  return (_: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes(res.locals.user.role)) {
      console.log("Not Allowed");

      res.status(401).json({ message: "You donot have access" });
      return;
    }
    next();
  };
};
