import { db } from "../database/db";
import { sendResponse } from "../utils";
import { createUser } from "./users";

export const Webhooks = async (req, res) => {
  const payload = req.body;
  const data = payload.data;

  const user_id = data?.id;
  const existingUser = await db
    .selectFrom("tbl_users")
    .select(["id"])
    .where("id", "=", user_id)
    .executeTakeFirst();

  if (existingUser) {
    res.send(
      sendResponse({
        data: existingUser.id,
        message: "User already exists",
        status: "success",
      })
    );
  }

  const response = (await createUser({
    created_at: data.created_at ? new Date(data.created_at) : new Date(),
    email_address: data?.email_addresses?.[0]?.email_address,
    id: data?.id,
    updated_at: data.updated_at ? new Date(data.updated_at) : new Date(),
    username: data?.username,
    profile_image_url: data?.profile_image_url,
  })) as any;
  res.send(
    sendResponse({
      data: parseInt((response.insertId || 0).toString()),
      message: "User created successfully",
      status: "success",
    })
  );
};
