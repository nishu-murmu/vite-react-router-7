import { app } from "../app";
import { upload } from "../utils/multer";
import { createBook } from "./books";

app.post("/api/book", upload.single("coverImage"), createBook);
