import { useUser } from "@clerk/react-router";
import { MessageCircle, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { config } from "~/utils/config";

interface ChatMessage {
  id?: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at?: Date;
  is_read?: boolean;
}

interface Contact {
  id: string;
  username: string;
  profile_image_url?: string;
  last_message_time?: Date;
}

const ChatComponent = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(
    undefined
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  /**
   *
   * PLEASE SETUP NGROK FOR LOCAL ENVIRNOMENT FOR CLERK WEBHOOKS TO WORK.
   *  ngrok http --url=optimum-slowly-lobster.ngrok-free.app 3000
   *
   */

  const { user } = useUser();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      block: "end",
    });
  };

  // Fetch user contacts
  const fetchContacts = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        config.serverUrl + `/api/chat/contacts?userId=${user.id}`
      );
      const result = await response.json();

      if (result.status === "success") {
        setContacts(result.data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // Fetch chat history with selected contact
  const fetchChatHistory = async (contactId: string) => {
    if (!user) return;

    try {
      const response = await fetch(
        config.serverUrl +
          `/api/chat/history?senderId=${user.id}&receiverId=${contactId}`
      );
      const result = await response.json();

      if (result.status === "success") {
        setMessages(result.data);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  // Initialize Socket Connection
  useEffect(() => {
    if (!user) return;

    // Connect to Socket.io server
    const newSocket = io("http://localhost:3001", {
      query: { userId: user?.id as string },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      newSocket.emit("register_user", user.id);
    });

    // Listen for incoming messages
    const handlePrivateMessage = (message: ChatMessage) => {
      if (
        selectedContact &&
        (message.sender_id === selectedContact.id ||
          message.sender_id === user.id)
      ) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
    };
    newSocket.on("receive_private_message", handlePrivateMessage);
    setSocket(newSocket);
    return () => {
      newSocket.off("receive_private_message", handlePrivateMessage);
      newSocket.disconnect();
    };
  }, [user, selectedContact]); // Add selectedContact to dependencies

  // Fetch contacts when component mounts
  useEffect(() => {
    fetchContacts();
  }, [user]);

  // Fetch chat history when contact is selected
  useEffect(() => {
    if (selectedContact) {
      fetchChatHistory(selectedContact.id);
    }
  }, [selectedContact]);

  // Send message handler
  const handleSendMessage = () => {
    if (!socket || !user || !selectedContact || !newMessage.trim()) return;
    const newMessageObj = {
      sender_id: user.id as string,
      receiver_id: selectedContact.id as string,
      message: newMessage as string,
    };
    setMessages((prev) => [...prev, newMessageObj]);
    scrollToBottom();

    // Emit private message event
    socket.emit("private_message", {
      senderId: user.id,
      receiverId: selectedContact.id,
      message: newMessage,
    });

    // Clear input
    setNewMessage("");
    messageInputRef.current?.focus();
  };

  // Handle message input key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Render contacts list
  const renderContactsList = () => (
    <Card className="w-1/4 h-[500px] border-r">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chats</h2>
        <MessageCircle className="text-muted-foreground" />
      </div>

      <ScrollArea className="h-[450px]">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`p-3 hover:bg-muted cursor-pointer flex items-center ${
              selectedContact?.id === contact.id ? "bg-muted" : ""
            }`}
            onClick={() => setSelectedContact(contact)}
          >
            <Avatar className="mr-3">
              <AvatarImage
                src={contact.profile_image_url}
                alt={contact.username}
              />
              <AvatarFallback>
                {contact.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{contact.username}</p>
              {contact.last_message_time && (
                <p className="text-xs text-muted-foreground">
                  {new Date(contact.last_message_time).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        ))}
        {contacts.length === 0 && (
          <div className="text-center text-muted-foreground p-4">
            No contacts found
          </div>
        )}
      </ScrollArea>
    </Card>
  );

  // Render chat messages
  const renderChatWindow = () => {
    if (!selectedContact) {
      return (
        <div className="flex-grow flex items-center justify-center text-muted-foreground">
          Select a contact to start chatting
        </div>
      );
    }

    return (
      <div className="flex-grow flex flex-col">
        {/* Chat Header */}
        <Card className="flex items-center p-4 border-b">
          <Avatar className="mr-3">
            <AvatarImage
              src={selectedContact.profile_image_url}
              alt={selectedContact.username}
            />
            <AvatarFallback>
              {selectedContact.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-semibold">{selectedContact.username}</h2>
        </Card>

        {/* Messages Area */}
        <ScrollArea className="flex-grow p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender_id === user?.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.sender_id === user?.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg?.created_at as Date).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}> </div>
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t flex items-center">
          <Input
            ref={messageInputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-grow mr-2"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="flex h-[500px] shadow-lg">
        {renderContactsList()}
        {renderChatWindow()}
      </Card>
    </div>
  );
};

export default ChatComponent;
