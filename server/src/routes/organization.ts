import express from "express";
import {
  createOrganization,
    deleteAllOrganizations,
    deleteManyOrganizations,
    deleteOrganization,
    getAllOrganizations,
    getOrganizationbyId,
    searchOrganizations,
    updateOrganization
} from "../controllers/organizations";
import { allowRoles, checkToken, requireAuth } from "../middlewares/auth.js";

const orgRouter = express.Router();

// Define your routes here
orgRouter.post("/", checkToken, requireAuth, allowRoles("ADMIN"), createOrganization);
orgRouter.get(
  "/",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  getAllOrganizations
);
orgRouter.get(
  "/search",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  searchOrganizations
);
orgRouter.get(
  "/:id",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  getOrganizationbyId
);
orgRouter.put(
  "/:id",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  updateOrganization
);

orgRouter.delete(
  "/:id",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  deleteOrganization
);
orgRouter.delete(
  "/delete",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  deleteManyOrganizations
);
orgRouter.delete(
  "/",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  deleteAllOrganizations
);
export default orgRouter;
