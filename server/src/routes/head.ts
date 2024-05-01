import express from "express";
import {
  createHead,
  getAllHeads,
  getHeadbyId,
  updateHead,
  deleteHead,
  deleteManyHeads,
  deleteAllHeads,
  searchHeads,
} from "../controllers/heads";
import { checkToken, requireAuth, allowRoles } from "../middlewares/auth.js";

const headRouter = express.Router();

// Define your routes here
headRouter.post(
  "/",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  createHead
);
headRouter.get(
  "/",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  getAllHeads
);
headRouter.get(
  "/search",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  searchHeads
);
headRouter.get(
  "/:id",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  getHeadbyId
);
headRouter.put(
  "/:id",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  updateHead
);

headRouter.delete(
  "/:id",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  deleteHead
);
headRouter.delete(
  "/delete",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  deleteManyHeads
);
headRouter.delete(
  "/",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  deleteAllHeads
);
export default headRouter;
