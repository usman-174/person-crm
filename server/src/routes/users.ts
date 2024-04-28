import express from "express";
import {
  addSocialPlatform,
  addUser,
  deleteAllUsers,
  deleteManyUsers,
  deleteUser,
  getAllUsers,
  getUserbyId,
  searchUsers,
  updateUser,
} from "../controllers/persons";
import { checkToken, requireAuth, allowRoles } from "../middlewares/auth.js";

const personRouter = express.Router();

// Define your routes here


personRouter.get("/", checkToken, requireAuth, allowRoles("ADMIN"), getAllUsers);
personRouter.post("/", checkToken, requireAuth, allowRoles("ADMIN"), addUser);
personRouter.post("/social", 
checkToken,
//  requireAuth, allowRoles("ADMIN"),
  addSocialPlatform);

personRouter.get(
  "/search",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  searchUsers
);
personRouter.get(
  "/:id",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  getUserbyId
);
personRouter.put(
  "/:id",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  updateUser
);

personRouter.delete(
  "/:id",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  deleteUser
);
personRouter.delete(
  "/delete",
  checkToken,
  requireAuth,
  allowRoles("ADMIN"),
  deleteManyUsers
);
personRouter.delete(
    "/",
    checkToken,
    requireAuth,
    allowRoles("ADMIN"),
    deleteAllUsers
  );
export default personRouter;
