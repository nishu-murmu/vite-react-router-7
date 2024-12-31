import { Request, Response } from "express";
import { db } from "../database/db";
import { sendResponse } from "../utils";

export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, user_id, is_public } = req.body;
    const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

    const book = await db
      .insertInto("tbl_books")
      .values({
        name: title,
        author: author,
        image: coverImage,
        is_public: is_public ? 1 : 0,
        user_id: user_id,
      })
      .executeTakeFirst();

    const createdBook = await db
      .selectFrom("tbl_books")
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

export const getPublicBooks = async (req: Request, res: Response) => {
  try {
    const response = await db
      .selectFrom("tbl_books")
      .innerJoin("tbl_users", "tbl_books.user_id", "tbl_users.id")
      .selectAll()
      .where("tbl_books.is_public", "=", 0)
      .execute();

    res.send(
      sendResponse({
        data: response || [],
        message: "Public books retrieved successfully",
        status: "success",
      })
    );
  } catch (error) {
    console.error("Error fetching public books:", error);
    res.status(500).send(
      sendResponse({
        data: [],
        message: "Failed to retrieve public books",
        status: "error",
      })
    );
  }
};
