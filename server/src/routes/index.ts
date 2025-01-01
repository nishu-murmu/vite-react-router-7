import bodyParser from "body-parser";
import { app } from "../app";
import { upload } from "../utils/multer";
import { createBook, getPublicBooks } from "./books";
import { getAllUsers } from "./users";
import { Webhooks } from "./webhooks";
import { Request, Response } from "express";
import { ensureUserChatRoom, getChatContacts, getChatHistory } from "./chat";
import { sendResponse } from "../utils";

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

// Chat Routes
app.get("/api/chat/contacts", async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    res.status(400).send(
      sendResponse({
        message: "User ID is required",
        status: "error",
        data: [],
      })
    );
  }

  try {
    // Ensure the user has a chat room
    await ensureUserChatRoom(userId as string);

    // Fetch user contacts
    await getChatContacts(req, res);
  } catch (error) {
    console.error("Error retrieving chat contacts:", error);
    res.status(500).send(
      sendResponse({
        message: "Failed to retrieve chat contacts",
        status: "error",
        data: [],
      })
    );
  }
});

app.get("/api/chat/history", async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.query;

  if (!senderId || !receiverId) {
    res.status(400).send(
      sendResponse({
        message: "Sender ID and Receiver ID are required",
        status: "error",
        data: [],
      })
    );
  }

  try {
    // Fetch chat history
    await getChatHistory(req, res);
  } catch (error) {
    console.error("Error retrieving chat history:", error);
    res.status(500).send(
      sendResponse({
        message: "Failed to retrieve chat history",
        status: "error",
        data: [],
      })
    );
  }
});
