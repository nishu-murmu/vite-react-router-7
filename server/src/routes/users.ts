import { Request, Response } from "express";
import { db } from "../database/db";
import { sendResponse } from "../utils";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const response = await db.selectFrom("tbl_users").selectAll().execute();
    res.send(
      sendResponse({
        data: response || [],
        message: "Book created successfully",
        status: "success",
      })
    );
  } catch (error) {
    console.log(error);
  }
};

export const createUser = async (props) => {
  console.log("🚀 ~ createUser ~ props:", props);
  try {
    const {
      created_at,
      email_address,
      id,
      updated_at,
      username,
      profile_image_url,
    } = props;
    const response = await db
      .insertInto("tbl_users")
      .values({
        created_at,
        email_address,
        id,
        updated_at,
        username,
        profile_image_url,
      })
      .executeTakeFirst();
    return response;
  } catch (error) {
    console.log(error);
  }
};
