import { Request, Response } from "express";
import prisma from "../../db";
import { constants } from "./constants";

export const createHead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const head = await prisma.head.create({
      data: {
        ...req.body,
        createdBy: { connect: { id: res.locals.user.id } },
        lastModifiedBy: { connect: { id: res.locals.user.id } },
      },
    });
    res.status(201).json(head);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const getAllHeads = async (_: Request, res: Response): Promise<void> => {
  try {
    const heads = await prisma.head.findMany({
      include: {
        school: true,
        organization: true,
      },
    });
    res.status(200).json(heads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const getHeadbyId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const head = await prisma.head.findUnique({
      where: { id: String(id) },

      include: {
        organization: true,
        school: true,
      },
    });
    if (!head) {
      res.status(404).json({ message: constants.HEAD_NOT_FOUND });
      return;
    }

    res.status(200).json(head);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const updateHead = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await prisma.head.update({
      where: { id: String(id) },
      data: {
        ...req.body,
        lastModifiedBy: { connect: { id: res.locals.user.id } },
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const deleteHead = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.head.delete({ where: { id: String(id) } });
    res.status(200).json({ message: constants.ALL_HEADS_DELETED });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ message: constants.HEAD_NOT_FOUND });
      return;
    }
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const deleteManyHeads = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { ids } = req.body;
  try {
    await prisma.head.deleteMany({ where: { id: { in: ids } } });
    res.status(204).json({ message: constants.ALL_HEADS_DELETED });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const deleteAllHeads = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    await prisma.head.deleteMany();
    res.status(204).json({ message: constants.ALL_HEADS_DELETED });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const searchHeads = async (req: Request, res: Response) => {
  const { query } = req.query; // Assuming the search query is passed as 'q' parameter

  try {
    const heads = await prisma.head.findMany({
      where: {
        OR: [
          { name: { contains: String(query) } },
          { gender: { contains: String(query) } },

          // Add more fields as needed
        ],
      },
    });
    res.json(heads);
  } catch (error) {
    console.error("Error searching heads:", error);
    res.status(500).json({ error: "An error occurred while searching heads" });
  }
};
