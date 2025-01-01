import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import { Request, Response } from "express";
import { db } from "../database/db";
import { sendResponse } from "../utils";
import { v4 as uuidv4 } from "uuid";

// Store active user socket connections
const userSockets = new Map<string, string>();

export const setupSocketServer = (expressApp: express.Application) => {
  const httpServer = createServer(expressApp);
  const io = new Server(expressApp.listen(process.env.SOCKET_PORT), {
    cors: {
      origin: [
        process.env.SOCKET_PORT as string,
        process.env.PORT as string,
        "http://localhost:5173",
      ], // Add your frontend URLs
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    // Register user's socket connection
    socket.on("register_user", (userId: string) => {
      userSockets.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    // Handle private messages
    socket.on(
      "private_message",
      async (data: {
        senderId: string;
        receiverId: string;
        message: string;
      }) => {
        try {
          console.log("🚀 ~ io.on ~ data:", data);
          // Save message to database
          const savedMessage = await createChatMessage({
            sender_id: data.senderId,
            receiver_id: data.receiverId,
            message: data.message,
            is_read: 0,
          });

          // Find receiver's socket
          const receiverSocketId = userSockets.get(data.receiverId);
          console.log("🚀 ~ io.on ~ userSockets:", userSockets);
          console.log("🚀 ~ io.on ~ receiverSocketId:", receiverSocketId);

          if (receiverSocketId) {
            // Send message directly to receiver if online
            io.to(receiverSocketId).emit("receive_private_message", {
              ...savedMessage,
              sender_id: data.senderId,
            });
          }

          // Broadcast to sender's socket for UI update
          socket.emit("message_sent_confirmation", savedMessage);
        } catch (error) {
          console.error("Error processing private message:", error);
          socket.emit("message_error", {
            message: "Failed to send message",
            error: error,
          });
        }
      }
    );

    // Mark messages as read
    socket.on(
      "mark_messages_read",
      async (data: { senderId: string; receiverId: string }) => {
        try {
          await markMessagesAsRead(data.senderId, data.receiverId);

          // Notify sender that messages are marked as read
          socket.emit("messages_read_confirmation", {
            senderId: data.senderId,
            receiverId: data.receiverId,
          });
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
      }
    );

    // Handle user disconnection
    socket.on("disconnect", () => {
      // Remove user from active sockets
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
      console.log("Client disconnected");
    });
  });

  return httpServer;
};

export const getChatContacts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    // Fetch unique contacts who have chatted with the user
    const contacts = await db
      .selectFrom("tbl_chat_messages")
      .innerJoin("tbl_users", "tbl_users.id", "tbl_chat_messages.sender_id")
      .select([
        "tbl_users.id",
        "tbl_users.username",
        "tbl_users.profile_image_url",
        db.fn.max("tbl_chat_messages.created_at").as("last_message_time"),
      ])
      .where((eb) =>
        eb.or([
          eb("sender_id", "=", userId as string),
          eb("receiver_id", "=", userId as string),
        ])
      )
      .groupBy("tbl_users.id")
      .execute();
    console.log("🚀 ~ getChatContacts ~ contacts:", contacts);

    res.send(
      sendResponse({
        data: contacts,
        message: "Contacts retrieved successfully",
        status: "success",
      })
    );
  } catch (error) {
    console.error("Error retrieving contacts:", error);
    res.status(500).send(
      sendResponse({
        data: null,
        message: "Failed to retrieve contacts",
        status: "error",
      })
    );
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId } = req.query;

    // Fetch chat history between two users
    const chatHistory = await db
      .selectFrom("tbl_chat_messages")
      .selectAll()
      .where((eb) =>
        eb.or([
          eb.and({
            sender_id: senderId as string,
            receiver_id: receiverId as string,
          }),
          eb.and({
            sender_id: receiverId as string,
            receiver_id: senderId as string,
          }),
        ])
      )
      .orderBy("created_at", "asc")
      .execute();

    res.send(
      sendResponse({
        data: chatHistory,
        message: "Chat history retrieved successfully",
        status: "success",
      })
    );
  } catch (error) {
    console.error("Error retrieving chat history:", error);
    res.status(500).send(
      sendResponse({
        data: null,
        message: "Failed to retrieve chat history",
        status: "error",
      })
    );
  }
};

export const createChatMessage = async (messageData: any) => {
  try {
    // Generate a unique ID for the message
    const messageId = uuidv4();

    // Insert the message into the database
    const result = await db
      .insertInto("tbl_chat_messages")
      .values({
        ...messageData,
        id: messageId,
        created_at: new Date(),
        is_read: false,
      })
      .executeTakeFirst();

    return {
      id: messageId,
      ...messageData,
      created_at: new Date(),
      is_read: false,
    };
  } catch (error) {
    console.error("Error creating chat message:", error);
    throw error;
  }
};

export const markMessagesAsRead = async (
  senderId: string,
  receiverId: string
) => {
  try {
    await db
      .updateTable("tbl_chat_messages")
      .set({ is_read: 1 })
      .where("sender_id", "=", senderId)
      .where("receiver_id", "=", receiverId)
      .where("is_read", "=", 0)
      .execute();
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }
};

export const createChatRoomMember = async (roomId: string, userId: string) => {
  try {
    // Check if the user is already a member of the room
    const existingMember = await db
      .selectFrom("tbl_chat_room_members")
      .select(["joined_at", "room_id", "user_id"])
      .where("room_id", "=", roomId)
      .where("user_id", "=", userId)
      .executeTakeFirst();

    if (!existingMember) {
      // Create a new chat room member
      const newMember = {
        room_id: roomId,
        user_id: userId,
        joined_at: new Date(),
      };

      await db.insertInto("tbl_chat_room_members").values(newMember).execute();
    }
  } catch (error) {
    console.error("Error creating chat room member:", error);
    throw error;
  }
};

export const ensureUserChatRoom = async (userId: string) => {
  try {
    // Check if the user has a chat room
    const existingRoom = await db
      .selectFrom("tbl_chat_rooms")
      .select(["id", "name", "created_by", "created_at"]) // Specify the columns to select
      .where("created_by", "=", userId)
      .executeTakeFirst();

    if (!existingRoom) {
      // Create a new chat room for the user
      const newRoom = {
        id: uuidv4(),
        name: `${userId}'s Chat Room`,
        created_by: userId,
        created_at: new Date(),
      };

      await db.insertInto("tbl_chat_rooms").values(newRoom).execute();

      // Add the user as a member of the new chat room
      await createChatRoomMember(newRoom.id, userId);
    }
  } catch (error) {
    console.error("Error ensuring user chat room:", error);
    throw error;
  }
};
export const getUserContacts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    // Fetch unique contacts who have chatted with the user
    const contacts = await db
      .selectFrom("tbl_chat_messages")
      .innerJoin("tbl_users", "tbl_users.id", "tbl_chat_messages.sender_id")
      .select([
        "tbl_users.id",
        "tbl_users.username",
        "tbl_users.profile_image_url",
        db.fn.max("tbl_chat_messages.created_at").as("last_message_time"),
      ])
      .where((eb) =>
        eb.or([
          eb("sender_id", "=", userId as string),
          eb("receiver_id", "=", userId as string),
        ])
      )
      .groupBy("tbl_users.id")
      .execute();

    res.send(
      sendResponse({
        data: contacts,
        message: "Contacts retrieved successfully",
        status: "success",
      })
    );
  } catch (error) {
    console.error("Error retrieving contacts:", error);
    res.status(500).send(
      sendResponse({
        data: null,
        message: "Failed to retrieve contacts",
        status: "error",
      })
    );
  }
};
