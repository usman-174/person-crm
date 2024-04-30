import { Request, Response } from "express";
import prisma from "../../db";
import { constants } from "./constants";

export const createSchool = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const school = await prisma.school.create({
      data: {
        ...req.body,
        createdBy: { connect: { id: res.locals.user.id } },
        lastModifiedBy: { connect: { id: res.locals.user.id } },
      },
    });
    res.status(201).json(school);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const getAllSchools = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    const schools = await prisma.school.findMany({
      include:{
        head:true,
        organization:true,
        createdBy:true,
        lastModifiedBy:true
      }
    });
    res.status(200).json(schools);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const getSchoolbyId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const school = await prisma.school.findUnique({
      where: { id: String(id) },

      include: { createdBy: true, lastModifiedBy: true 
        ,
        head:true,
        organization:true,
        

      },
    });
    if (!school) {
      res.status(404).json({ message: constants.SCHOOL_NOT_FOUND });
      return;
    }
    if (school?.createdBy?.password) {
      school.createdBy.password = null;
    }
    if (school?.lastModifiedBy?.password) {
      school.lastModifiedBy.password = null;
    }
    res.status(200).json(school);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const updateSchool = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await prisma.school.update({
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

export const deleteSchool = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.school.delete({ where: { id: String(id) } });
    res.status(200).json({ message: constants.ALL_SCHOOLS_DELETED });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ message: constants.SCHOOL_NOT_FOUND });
      return;
    }
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const deleteManySchools = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { ids } = req.body;
  try {
    await prisma.school.deleteMany({ where: { id: { in: ids } } });
    res.status(204).json({ message: constants.ALL_SCHOOLS_DELETED });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const deleteAllSchools = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    await prisma.school.deleteMany();
    res.status(204).json({ message: constants.ALL_SCHOOLS_DELETED });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const searchSchools = async (req: Request, res: Response) => {
  const { query } = req.query; // Assuming the search query is passed as 'q' parameter

  try {
    const schools = await prisma.school.findMany({
      where: {
        OR: [
          { name: { contains: String(query) } },
          { city: { contains: String(query) } },
          { state: { contains: String(query) } },
          { notes: { contains: String(query) } },

          // Add more fields as needed
        ],
      },
    });
    res.json(schools);
  } catch (error) {
    console.error("Error searching schools:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching schools" });
  }
};
