import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { config } from "~/utils/config";

const PublicBooksGrid = ({ books }: { books: any[] }) => {
  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Public Books</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {books.map((book) => (
          <Card key={book.id} className="flex flex-col max-w-[200px]">
            <CardHeader className="p-2 pb-0 space-y-0">
              <div className="aspect-[3/4] overflow-hidden rounded-md max-h-[180px]">
                <img
                  src={config.serverUrl + book.image}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardHeader>

            <CardContent className="p-2 space-y-0">
              <CardTitle className="text-sm font-medium line-clamp-1">
                {book.title}
              </CardTitle>
              <p className="text-muted-foreground text-xs line-clamp-1">
                {book.author}
              </p>
            </CardContent>

            <CardFooter className="p-2 pt-0">
              <div className="flex items-center gap-1.5">
                <Avatar className="w-5 h-5">
                  <AvatarImage
                    src={book.user_profile_image_url}
                    alt={book.username}
                  />
                  <AvatarFallback className="text-[10px]">
                    {book.username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Badge variant="secondary" className="text-[10px] px-1 py-0">
                  {book.username}
                </Badge>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No public books available
        </div>
      )}
    </div>
  );
};

export default PublicBooksGrid;
