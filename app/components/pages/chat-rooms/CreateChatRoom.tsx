import { useState } from "react";
import { useUser } from "@clerk/react-router";
import { Hash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { config } from "~/utils/config";
import { useToast } from "~/hooks/use-toast";

interface CreateRoomFormData {
  name: string;
  topic: string;
  description: string;
  icon?: string;
}

const CreateChatRoom = ({ onRoomCreated }: { onRoomCreated?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateRoomFormData>({
    name: "",
    topic: "",
    description: "",
  });

  const { user } = useUser();
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${config.serverUrl}/api/chat/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          created_by: user?.id,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        toast({
          title: "Success",
          description: "Chat room created successfully!",
        });
        setIsOpen(false);
        setFormData({ name: "", topic: "", description: "" });
        onRoomCreated?.();
      } else {
        throw new Error(result.message || "Failed to create chat room");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create chat room. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create New Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Chat Room</DialogTitle>
            <DialogDescription>
              Create a new chat room where people can join and discuss topics.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter room name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                name="topic"
                placeholder="Enter room topic"
                value={formData.topic}
                onChange={handleInputChange}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what this room is about..."
                value={formData.description}
                onChange={handleInputChange}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon URL (Optional)</Label>
              <Input
                id="icon"
                name="icon"
                placeholder="Enter icon URL"
                value={formData.icon}
                onChange={handleInputChange}
                className="col-span-3"
              />
              {formData.icon ? (
                <div className="flex items-center gap-2">
                  <img
                    src={formData.icon}
                    alt="Room icon preview"
                    className="w-8 h-8 rounded"
                    onError={(e) => {
                      e.currentTarget.src = "";
                      setFormData((prev) => ({ ...prev, icon: "" }));
                      toast({
                        variant: "destructive",
                        title: "Error",
                        description:
                          "Failed to load icon URL. Please try a different URL.",
                      });
                    }}
                  />
                  <span className="text-sm text-muted-foreground">
                    Icon preview
                  </span>
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded border bg-muted">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChatRoom;
