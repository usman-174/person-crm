import { config } from "dotenv";
import express, { Request, Response } from "express";
import prisma from "./db/index.js";
import authRouter from "./routes/auth.js";
import orgRouter from "./routes/organization.js";
import personRouter from "./routes/users.js";
import cors from "cors";
import schoolRouter from "./routes/school.js";
if (process.env.NODE_ENV !== "production") {
  config();
}

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.get("/", (_: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});
const api = express.Router();
app.use("/api", api);
api.get("/all-counts", async (_: Request, res: Response) => {
  try {
    const personCount = await prisma.person.count();

    const schoolCount = await prisma.school.count();
    const organizationCount = await prisma.organization.count();
    console.log({ personCount, schoolCount, organizationCount });

    res.status(200).json({ personCount, schoolCount, organizationCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
api.use("/auth", authRouter);
api.use("/person", personRouter);
api.use("/school", schoolRouter);

api.use("/organization", orgRouter);

app.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});