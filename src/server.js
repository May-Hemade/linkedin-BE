import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";

import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import mongoose from "mongoose";
import experienceRouter from "./services/experiences/index.js";
import { join } from "path";
import profilesRouter from "./services/profiles/index.js";

const server = express();
const publicFolderPath = join(process.cwd(), "./public");

const port = process.env.PORT || 3001;
server.use(cors());
server.use(express.json());
const whiteListedOrigins = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

server.use(
  cors({
    origin: function (origin, next) {
      console.log("ORIGIN: ", origin);

      if (!origin || whiteListedOrigins.indexOf(origin) !== -1) {
        console.log("YAY!");
        next(null, true);
      } else {
        next(new Error("CORS ERROR!"));
      }
    },
  })
);
server.use(express.static(publicFolderPath));

server.use(express.json());
server.use("/profile", experienceRouter);

server.use("/profile", profilesRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log("Server runnning on port: ", port);
  });
});

server.on("error", (error) => {
  console.log(`Server is stopped : ${error}`);
});
