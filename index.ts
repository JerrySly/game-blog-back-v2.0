import "reflect-metadata";

import express from "express";
import dotenv from "dotenv";
import database from "./database";
import { InversifyExpressServer } from "inversify-express-utils";
import container from "./inversify.config";

import "./controllers/post.controller";
import "./controllers/auth.controller";
import "./controllers/comment.controller";
import "./controllers/images.controller";
import "./controllers/user.controller";
import "./controllers.role.controller";

import bodyParser from "body-parser";
import cors from "cors";
import { corsOption } from "./cors";

dotenv.config();
const app = express();

app.use(cors(corsOption));
app.use(bodyParser.json());

try {
  database.authenticate().catch((e) => {
    console.log("Error on database auth", e);
  });
} catch (e) {
  console.log("Error on database auth", e);
}

let server = new InversifyExpressServer(
  container,
  null,
  { rootPath: "/" },
  app
);

let appConfigured = server.build();

appConfigured.listen(8000, () => {
  console.log("START SERVER");
});
