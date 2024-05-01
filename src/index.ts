import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { workerRouter } from "./api/v1/routes/workerRouter";
import { v4 as uuidv4 } from "uuid";
import { dbConnection } from "./api/v1/db/db";
import http from "http";
import socketIO, { Server } from "socket.io";
import { tasksData } from "./api/v1/utils/data/tasksData";
import { formatDateAndSetToIST } from "./api/v1/utils/formatDateAndSetToIST";
import cookieParser from 'cookie-parser';
import { adminRouter } from "./api/v1/routes/adminRouter";

//configure env variables
dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/v1/worker", workerRouter);
app.use("/api/v1/admin", adminRouter);

app.get("/", async (req, res) => {
  const date = new Date();
  const test = new Date("2023-06-10 11:38:51.785");
  const date1 = await formatDateAndSetToIST(date);
  const date2 = await formatDateAndSetToIST(test);

  console.log(date1 === date2);

  res.json({ date1, date2 });
});

server.listen(PORT, () => {
  console.log(`⚡️ [server]: Server is running at http://localhost:${PORT}`);
  dbConnection();
});
