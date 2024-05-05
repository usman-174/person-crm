import { Request, Response } from "express";
import prisma from "../../db";
import { constants } from "./constants";

export const addSocialPlatform = async (req: Request, res: Response) => {
  try {
    const socialPlatforms = await prisma.social.create({
      data: req.body,
    });
    res.status(200).json(socialPlatforms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};
export const deleteSocialPlatform = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.social.delete({ where: { id: String(id) } });
    res.status(200).json({ message: constants.SOCIAL_PLATFORM_DELETED });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};
export const getAllSocialPlatforms = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    const socialPlatforms = await prisma.social.findMany();
    res.status(200).json(socialPlatforms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const getAllUsers = async (_: Request, res: Response): Promise<void> => {
  try {
    console.log("Asking Users");
    
    const users = await prisma.person.findMany({
      include: { social: true, incidents: { orderBy: { createdAt: "desc" } } },
      // orderBy: {  incidents: { createdAt: "desc" }},
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.person.create({
      data: {
        ...req.body,
        createdBy: { connect: { id: res.locals.user.id } },
        lastModifiedBy: { connect: { id: res.locals.user.id } },
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const getUserbyId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await prisma.person.findUnique({
      where: { id: String(id) },
      include: {
        social: true,
        createdBy: true,
        lastModifiedBy: true,
      },
    });
    console.log(user);

    if (!user) {
      res.status(404).json({ message: constants.USER_NOT_FOUND });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { social, ...rest } = req.body;
  console.log({ rest });

  try {
    const user = await prisma.person.update({
      where: { id: String(id) },
      data: {
        ...rest,

        lastModifiedBy: { connect: { id: res.locals.user.id } },
      },
    });
    for (const record of social) {
      await prisma.social.update({
        where: {
          id: record.id,
        },
        data: {
          account: record.account,
          platform: record.platform,
        },
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.person.delete({ where: { id: String(id) } });
    res.status(200).json({ message: constants.ALL_USERS_DELETED });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ message: constants.USER_NOT_FOUND });
      return;
    }
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const deleteManyUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { ids } = req.body;
  try {
    await prisma.person.deleteMany({ where: { id: { in: ids } } });
    res.status(204).json({ message: constants.USERS_DELETED });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const deleteAllUsers = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    await prisma.person.deleteMany();
    res.status(204).json({ message: constants.ALL_USERS_DELETED });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  const { query } = req.query; // Assuming the search query is passed as 'q' parameter

  try {
    const users = await prisma.person.findMany({
      where: {
        OR: [
          { username: { contains: query as string } },
          { TFF_ID: { contains: query as string } },
          { fname: { contains: query as string } },
          { mname: { contains: query as string } },
          { lname: { contains: query as string } },
          { address: { contains: query as string } },
          { address2: { contains: query as string } },
          { city: { contains: query as string } },
          { state: { contains: query as string } },
          { country: { contains: query as string } },
          // { role: { contains: query as string } },
          { title: { contains: query as string } },
          { notes: { contains: query as string } },
          // Add more fields as needed
        ],
      },
      // include: { social: true },
    });
    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "An error occurred while searching users" });
  }
};
