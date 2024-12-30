import { Request, Response } from "express";
import { db } from "../database/db";
import { sendResponse } from "../utils";

export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author } = req.body;
    const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

    console.log("🚀 ~ createBook ~ coverImage:", coverImage);
    const book = await db
      .insertInto("books")
      .values({
        name: title,
        author: author,
        image: coverImage,
        user_id: 1,
      })
      .executeTakeFirst();

    const createdBook = await db
      .selectFrom("books")
      .selectAll()
      .where("id", "=", parseInt((book.insertId || 0).toString()))
      .executeTakeFirst();

    res.status(201).send(
      sendResponse({
        data: createdBook,
        message: "Book created successfully",
        status: "success",
      })
    );
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).send(
      sendResponse({
        message: "Error creating book",
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        data: null,
      })
    );
  }
};
