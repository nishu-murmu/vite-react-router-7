import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const AllUsersComponent = ({ users }: any) => {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-background">
      <div className="container max-w-5xl py-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">All Users</h2>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Accuracy</TableHead>
                  <TableHead className="text-right">Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={user.profile_image_url}
                            alt={user.username}
                          />
                          <AvatarFallback>
                            {user.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.username}</span>
                          <span className="text-muted-foreground text-xs">
                            {user.email_address}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {user.score?.toFixed(2) || 0}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {user.accuracy?.toFixed(2) || 0}%
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(user.updated_at).toLocaleDateString()}{" "}
                      {new Date(user.updated_at).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AllUsersComponent;
