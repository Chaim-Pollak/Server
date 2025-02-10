import express from "express";
import { config } from "dotenv";
import mongoDB from "./database/connectDB.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import cron from "node-cron";

cron.schedule("1 3 * * *", () => {
  console.log("running a task every minute");
});
config();
mongoDB();

const app = express();
app.use(express.json());

import issuesRouter from "./routers/issues.routter.js";
import usersRouter from "./routers/users.router.js";
import professionsRouter from "./routers/profession.router.js";
import generalRouter from "./routers/general.router.js";

const allowedOrigins = process.env.CORS_ORIGIN.split(",");
app.use(
  cors({
    credentials: true,
    optionsSuccessStatus: 200,
    origin: allowedOrigins,
  })
);
app.use(cookieParser());
app.use("/users", usersRouter);
app.use("/issues", issuesRouter);
app.use("/professions", professionsRouter);
app.use("/general", generalRouter);

const port = process.env.PORT;
app.listen(port, () => console.log(`server is running on port ${port}`));
