import { Crown, Medal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
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
                  <TableHead className="w-14">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Accuracy</TableHead>
                  <TableHead className="text-right">Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {user.rank === 1 ? (
                        <Crown className="h-5 w-5 text-yellow-500" />
                      ) : user.rank === 2 ? (
                        <Medal className="h-5 w-5 text-gray-400" />
                      ) : user.rank === 3 ? (
                        <Medal className="h-5 w-5 text-amber-600" />
                      ) : (
                        user.rank
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={user.avatarUrl}
                            alt={user.username}
                          />
                          <AvatarFallback>
                            {user.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.username}</span>
                          {user.badges?.map((badge: any) => (
                            <Badge
                              key={badge}
                              variant="default"
                              className="w-fit text-xs"
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {user.score.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {user.accuracy.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(user.lastActive).toLocaleDateString()}{" "}
                      {new Date(user.lastActive).toLocaleTimeString()}
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
