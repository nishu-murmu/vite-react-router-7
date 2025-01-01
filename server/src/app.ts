import express from "express";
import { connect } from "./database/db";
import dotenv from "dotenv";

dotenv.config({
  encoding: "utf8",
});

export const app = express();

import "./middleware";
import "./routes";

app.listen(process.env.PORT, () => {
  console.log("Listening on port 3000");
  connect();
});
