import { app } from "../app";
import cors from "cors";
import path from "path";
import express from "express";

app.use(express.urlencoded({ extended: true }));
const corsConfig: cors.CorsOptions = {
  origin: true,
  credentials: true,
};
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.get("/", (req, res) => {
  res.send("Local Server connected successfully");
});
