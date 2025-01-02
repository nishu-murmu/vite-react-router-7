import { Request, Response } from "express";
import { db } from "../database/db";
import { sendResponse } from "../utils";
import { v4 as uuidv4 } from "uuid";


export const getChatRooms = async (req: Request, res: Response) => {
  try {
    const chatrooms = await db
      .selectFrom("tbl_chat_rooms")
      .selectAll()
      .execute();
    res.send(
      sendResponse({
        data: chatrooms,
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

export const getChatContacts = async (req: Request, res: Response) => {
  try {
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
    const contacts = await db
      .selectFrom("tbl_chat_room_members")
      .innerJoin("tbl_users", "tbl_users.id", "tbl_chat_room_members.user_id")
      .where('tbl_users.id', "!=", userId as string)
      .selectAll()
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

export const getChatHistory = async (req: Request, res: Response) => {
  try {
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
    const messageId = uuidv4();
    await db
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

