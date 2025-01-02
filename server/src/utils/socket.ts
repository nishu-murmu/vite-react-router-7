import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import { createChatMessage, markMessagesAsRead } from "../routes/chat";
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
      ],
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
          // Save message to database
          const savedMessage = await createChatMessage({
            sender_id: data.senderId,
            receiver_id: data.receiverId,
            message: data.message,
            is_read: 0,
          });

          // Find receiver's socket
          const receiverSocketId = userSockets.get(data.receiverId);

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
