import express from "express";
import {
  getMe,
  loginController,
  registerController,
} from "../controllers/auth";
import { checkToken, requireAuth } from "../middlewares/auth.js";

const authRouter = express.Router();

// Define your routes here

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/me",checkToken,requireAuth, getMe);

export default authRouter;
