import express from "express";
import cors from "cors";
import { connect } from "./database/db";
import path from "path";

export const app = express();

app.use(express.urlencoded({ extended: true }));
const corsConfig: cors.CorsOptions = {
  origin: true,
  credentials: true,
};
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.get("/", (req, res) => {
  res.send("Hello World!");
});
import "./routes";

app.listen(3000, () => {
  console.log("Listening on port 3000");
  connect();
});
