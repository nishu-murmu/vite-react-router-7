import { useEffect, useState } from "react";
import { Hash, Plus } from "lucide-react";
import { useUser } from "@clerk/react-router";
import { useNavigate } from "react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Badge } from "~/components/ui/badge";
import { AppRoutes, config } from "~/utils/config";
import CreateChatRoom from "./CreateChatRoom";

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  topic: string;
  icon: string;
  created_by: string;
  created_at: Date;
}

const ChatRoomsList = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const { user } = useUser();
  const navigate = useNavigate();

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
    navigate(AppRoutes.singleChatRoom.replace(":id", room.id));
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Hash className="h-6 w-6" />
          Chat Rooms
        </h1>
        <CreateChatRoom  onRoomCreated={fetchChatRooms} />
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {chatRooms.map((room) => (
            <Card
              key={room.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleRoomSelect(room)}
            >
              <CardHeader className="space-y-1">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-background">
                    {room.icon ? (
                      <img
                        src={room.icon}
                        alt={room.name}
                        className="h-8 w-8"
                      />
                    ) : (
                      <Hash className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    {room.topic && (
                      <CardDescription className="text-sm">
                        {room.topic}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {room.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {room.description}
                  </p>
                )}
              </CardContent>

              <CardFooter className="flex justify-between items-center">
                <Badge
                  variant={
                    room.created_by === user?.id ? "default" : "secondary"
                  }
                >
                  {room.created_by === user?.id
                    ? "Created by you"
                    : "Created by others"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(room.created_at).toLocaleDateString()}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatRoomsList;
