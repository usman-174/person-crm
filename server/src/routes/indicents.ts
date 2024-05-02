import express from "express";
import {
  createIncident,
  deleteAllIncidents,
  deleteManyIncidents,
  deleteIncident,
  getAllIncidents,
  getIncidentbyId,
  searchIncidents,
  updateIncident,
} from "../controllers/incidents";
import { allowRoles, checkToken, requireAuth } from "../middlewares/auth.js";

const incidentRouter = express.Router();

// Define your routes here
incidentRouter.post(
  "/",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  createIncident
);
incidentRouter.get(
  "/", 
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  getAllIncidents
);
incidentRouter.get(
  "/search",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  searchIncidents
);
incidentRouter.get(
  "/:id",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  getIncidentbyId
);
incidentRouter.put(
  "/:id",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  updateIncident
);

incidentRouter.delete(
  "/:id",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  deleteIncident
);
incidentRouter.delete(
  "/delete",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  deleteManyIncidents
);
incidentRouter.delete(
  "/",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  deleteAllIncidents
);
export default incidentRouter;
