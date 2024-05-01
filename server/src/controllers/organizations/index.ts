import { Request, Response } from "express";
import prisma from "../../db";
import { constants } from "./constants";

export const getAllOrganizations = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    const organizations = await prisma.organization.findMany({
      include: {
        createdBy: true,
        lastModifiedBy: true,
        heads: true,
        schools: true,
      },
    });
    res.status(200).json(organizations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const createOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const organization = await prisma.organization.create({
      data: {
        ...req.body,

        createdBy: { connect: { id: res.locals.user.id } },
        lastModifiedBy: { connect: { id: res.locals.user.id } },
      },
    });
    res.status(201).json(organization);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const getOrganizationbyId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: String(id) },
      include: {
        createdBy: true,
        lastModifiedBy: true,
        heads: true,
        schools: true,
      },
    });
    //delete passwords
    if (organization?.createdBy?.password) {
      organization.createdBy.password = null;
    }
    if (organization?.lastModifiedBy?.password) {
      organization.lastModifiedBy.password = null;
    }
    if (!organization) {
      res.status(404).json({ message: constants.ORGANIZATION_NOT_FOUND });
      return;
    }

    res.status(200).json(organization);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const updateOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const organization = await prisma.organization.update({
      where: { id: String(id) },
      data: {
        ...req.body,
        lastModifiedBy: { connect: { id: res.locals.user.id } },
      },
    });
    res.status(200).json(organization);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const deleteOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.organization.delete({ where: { id: String(id) } });
    res.status(200).json({ message: constants.ALL_ORGANIZATIONS_DELETED });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ message: constants.ORGANIZATION_NOT_FOUND });
      return;
    }
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const deleteManyOrganizations = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { ids } = req.body;
  try {
    await prisma.organization.deleteMany({ where: { id: { in: ids } } });
    res.status(204).json({ message: constants.ALL_ORGANIZATIONS_DELETED });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const deleteAllOrganizations = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    await prisma.organization.deleteMany();
    res.status(204).json({ message: constants.ALL_ORGANIZATIONS_DELETED });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const searchOrganizations = async (req: Request, res: Response) => {
  const { query } = req.query; // Assuming the search query is passed as 'q' parameter

  try {
    const organizations = await prisma.organization.findMany({
      where: {
        OR: [
          { name: { contains: String(query) } },
          { city: { contains: String(query) } },

          { notes: { contains: String(query) } },

          // Add more fields as needed
        ],
      },
    });
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};
