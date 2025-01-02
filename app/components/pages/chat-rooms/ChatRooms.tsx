import React, { useEffect, useState } from "react";
import { Hash, Plus, Users } from "lucide-react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { config } from "~/utils/config";
import { useUser } from "@clerk/react-router";

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  topic: string;
  icon: string;
  created_by: string;
  created_at: Date;
}

const ChatRoomsList = ({ onRoomSelect }: any) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const { user } = useUser();

  const fetchChatRooms = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/api/chat/rooms`);
      const result = await response.json();

      if (result.status === "success") {
        setChatRooms(result.data);
      }
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const handleRoomSelect = (room: ChatRoom) => {
    setSelectedRoom(room.id);
    onRoomSelect(room);
  };

  return (
    <Card className="w-80 h-[600px] border-r flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Hash className="h-5 w-5" />
          Chat Rooms
        </h2>
        <Button variant="ghost" size="icon" className="hover:bg-muted">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1">
          {chatRooms.map((room) => (
            <div
              key={room.id}
              className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-muted transition-colors
                ${selectedRoom === room.id ? "bg-muted" : ""}
              `}
              onClick={() => handleRoomSelect(room)}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-background">
                {room.icon ? (
                  <img src={room.icon} alt={room.name} className="h-5 w-5" />
                ) : (
                  <Hash className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium leading-none">{room.name}</h3>
                </div>
                {room.topic && (
                  <p className="text-xs text-muted-foreground">
                    Topic: {room.topic}
                  </p>
                )}
                {room.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {room.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>
                    Created by {room.created_by === user?.id ? "you" : "others"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ChatRoomsList;
