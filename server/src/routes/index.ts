import bodyParser from "body-parser";
import { app } from "../app";
import { upload } from "../utils/multer";
import { createBook, getPublicBooks } from "./books";
import { getAllUsers } from "./users";
import { Webhooks } from "./webhooks";

// User Routes
app.get("/api/users", getAllUsers);

// Book Routes
app.post("/api/book", upload.single("coverImage"), createBook);
app.get("/api/books", getPublicBooks);

// Clerk Webhooks
app.post(
  "/api/webhooks",
  bodyParser.raw({ type: "application/json" }),
  Webhooks
);
