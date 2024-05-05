import { Request, Response } from "express";
import prisma from "../../db";
import { constants } from "./constants";

export const getAllIncidents = async (
  _: Request,
  res: Response
): Promise<void> => {
  console.log("yeaa");
  
  try {
    const incidents = await prisma.incident.findMany({
      include: {
        createdBy: true,
        lastModifiedBy: true,
        organizations: true,
        persons: true,
        schools: true,
      },
      orderBy: { createdAt: "desc" }, // Sort by createdAt in descending order
    });
    console.log(incidents);
    
    res.status(200).json(incidents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const createIncident = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { personIds, schoolIds, organizationIds, ...rest } = req.body;
    // console.log(JSON.stringify( {
    //   ...rest,
    //   ...(personIds?.length
    //     ? { persons: { connect: personIds.map((id: string) => ({ id })) } }
    //     : {}),
    //   ...(schoolIds?.length
    //     ? { schools: { connect: schoolIds.map((id: string) => ({ id })) } }
    //     : {}),
    //   ...(organizationIds?.length
    //     ? {
    //         organizations: {
    //           connect: organizationIds.map((id: string) => ({ id })),
    //         },
    //       }
    //     : {}),

    //   createdBy: { connect: { id: res.locals.user.id } },
    //   lastModifiedBy: { connect: { id: res.locals.user.id } },
    // }));

    const incident = await prisma.incident.create({
      data: {
        ...rest,
        ...(personIds?.length
          ? { persons: { connect: personIds.map((id: string) => ({ id })) } }
          : {}),
        ...(schoolIds?.length
          ? { schools: { connect: schoolIds.map((id: string) => ({ id })) } }
          : {}),
        ...(organizationIds?.length
          ? {
              organizations: {
                connect: organizationIds.map((id: string) => ({ id })),
              },
            }
          : {}),

        createdBy: { connect: { id: res.locals.user.id } },
        lastModifiedBy: { connect: { id: res.locals.user.id } },
      },
    });
    res.status(201).json(incident);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const getIncidentbyId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const incidents = await prisma.incident.findUnique({
      where: { id: String(id) },
      include: {
        createdBy: true,
        lastModifiedBy: true,
        organizations: true,
        persons: true,
        schools: true,
      },
    });
    //delete passwords
    if (incidents?.createdBy?.password) {
      incidents.createdBy.password = null;
    }
    if (incidents?.lastModifiedBy?.password) {
      incidents.lastModifiedBy.password = null;
    }
    if (!incidents) {
      res.status(404).json({ message: constants.INCIDENT_NOT_FOUND });
      return;
    }

    res.status(200).json(incidents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const updateIncident = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { personIds, schoolIds, organizationIds, ...rest } = req.body;

  try {
    const incident = await prisma.incident.update({
      where: { id: String(id) },
      data: {
        ...rest,
        ...(personIds?.length
          ? { persons: { set: personIds.map((id: string) => ({ id })) } }
          : {}),
        ...(schoolIds?.length
          ? { schools: { set: schoolIds.map((id: string) => ({ id })) } }
          : {}),
        ...(organizationIds?.length
          ? {
              organizations: {
                set: organizationIds.map((id: string) => ({ id })),
              },
            }
          : {}),
        lastModifiedBy: { connect: { id: res.locals.user.id } },
      },
    });
    res.status(200).json(incident);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const deleteIncident = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.incident.delete({ where: { id: String(id) } });
    res.status(200).json({ message: constants.ALL_INCIDENTS_DELETED });
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ message: constants.INCIDENT_NOT_FOUND });
      return;
    }
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const deleteManyIncidents = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { ids } = req.body;
  try {
    await prisma.incident.deleteMany({ where: { id: { in: ids } } });
    res.status(204).json({ message: constants.ALL_INCIDENTS_DELETED });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const deleteAllIncidents = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    await prisma.incident.deleteMany();
    res.status(204).json({ message: constants.ALL_INCIDENTS_DELETED });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};

export const searchIncidents = async (req: Request, res: Response) => {
  const { query } = req.query; // Assuming the search query is passed as 'q' parameter

  try {
    const incidents = await prisma.incident.findMany({
      where: {
        OR: [
          { location: { contains: String(query) } },
          { type: { contains: String(query) } },
          { notes: { contains: String(query) } },
          { time: { contains: String(query) } },

          // Add more fields as needed
        ],
      },
      include: {
        createdBy: true,
        lastModifiedBy: true,
        organizations: true,
        persons: true,
        schools: true,
      },
    });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: constants.INTERNAL_SERVER });
  }
};
