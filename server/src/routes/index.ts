import { app } from "../app";
import { createBook } from "./books";

app.post("/api/book", createBook);
