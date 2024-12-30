import { Request, Response } from "express";
import { db } from "../database/db";
import { sendResponse } from "../utils";

export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author } = req.body;
    const response = await db
      .insertInto("books")
      .values({
        name: title,
        author: author,
      })
      .executeTakeFirst();
    res.send(
      sendResponse({
        data: parseInt((response.insertId || 0).toString()),
        message: "Book created successfully",
        status: "success",
      })
    );
  } catch (error) {
    console.log(error);
  }
};