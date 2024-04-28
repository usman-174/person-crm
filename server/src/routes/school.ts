import express from "express";
import {
  createSchool,
  deleteAllSchools,
  deleteManySchools,
  deleteSchool,
  getAllSchools,
  getSchoolbyId,
  searchSchools,
  updateSchool,
} from "../controllers/schools";
import { checkToken, requireAuth, allowRoles } from "../middlewares/auth.js";

const schoolRouter = express.Router();

// Define your routes here
schoolRouter.post("/", checkToken, requireAuth, allowRoles("ADMIN"), createSchool);
schoolRouter.get(
  "/",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  getAllSchools
);
schoolRouter.get(
  "/search",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  searchSchools
);
schoolRouter.get(
  "/:id",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  getSchoolbyId
);
schoolRouter.put(
  "/:id",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  updateSchool
);

schoolRouter.delete(
  "/:id",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  deleteSchool
);
schoolRouter.delete(
  "/delete",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  deleteManySchools
);
schoolRouter.delete(
  "/",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  deleteAllSchools
);
export default schoolRouter;
