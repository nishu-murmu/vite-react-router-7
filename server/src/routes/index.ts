import bodyParser from "body-parser";
import express from "express";
import { app } from "../app";
import { sendResponse } from "../utils";
import { upload } from "../utils/multer";
import { createBook, getPublicBooks } from "./books";
import { createUser, getAllUsers } from "./users";
import { db } from "../database/db";

// app.post(
//   "/api/webhooks",
//   bodyParser.raw({ type: "application/json" }),
//   // This is a generic method to parse the contents of the payload.
//   // Depending on the framework, packages, and configuration, this may be
//   // different or not required.
//   async (req, res) => {
//     const SIGNING_SECRET = process.env.SIGNING_SECRET;

//     if (!SIGNING_SECRET) {
//       throw new Error(
//         "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env"
//       );
//     }

//     // Create new Svix instance with secret
//     const wh = new Webhook(SIGNING_SECRET);

//     // Get headers and body
//     const headers = req.headers;
//     const payload = req.body;

//     // Get Svix headers for verification
//     const svix_id = headers["svix-id"];
//     const svix_timestamp = headers["svix-timestamp"];
//     const svix_signature = headers["svix-signature"];

//     // If there are no headers, error out
//     if (!svix_id || !svix_timestamp || !svix_signature) {
//       return void res.status(400).json({
//         success: false,
//         message: "Error: Missing svix headers",
//       });
//     }

//     let evt;

//     // Attempt to verify the incoming webhook
//     // If successful, the payload will be available from 'evt'
//     // If verification fails, error out and return error code
//     try {
//       evt = wh.verify(payload, {
//         "svix-id": svix_id as string,
//         "svix-timestamp": svix_timestamp as string,
//         "svix-signature": svix_signature as string,
//       });
//       console.log("🚀 ~ payload:", {
//         dd: typeof payload,
//         svix_id,
//         svix_signature,
//         svix_timestamp,
//         evt,
//       });
//     } catch (err: any) {
//       console.log("Error: Could not verify webhook:", err.message);
//       return void res.status(400).json({
//         success: false,
//         message: err.message,
//       });
//     }

//     // Do something with payload
//     // For this guide, log payload to console
//     const { id } = evt.data;
//     const eventType = evt.type;
//     console.log(
//       `Received webhook with ID ${id} and event type of ${eventType}`
//     );
//     console.log("Webhook payload:", evt.data);

//     return void res.status(200).json({
//       success: true,
//       message: "Webhook received",
//     });
//   }
// );
app.use(express.json());

app.post(
  "/api/webhooks",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const payload = req.body;
    console.log(payload, "payload");
    const data = payload.data;
    console.log(data);

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
  }
);

app.post("/api/book", upload.single("coverImage"), createBook);
app.get("/api/users", getAllUsers);
app.get("/api/books", getPublicBooks);
