import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

const PublicBooksGrid = ({ books }: { books: any[] }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Public Books</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <Card key={book.id} className="flex flex-col">
            <CardHeader className="p-4 pb-0">
              <div className="aspect-[3/4] overflow-hidden rounded-md">
                <img
                  src={book.cover_image_url || "/placeholder-book-cover.png"}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardHeader>

            <CardContent className="flex-grow p-4 pb-2">
              <CardTitle className="text-xl line-clamp-2 mb-2">
                {book.title}
              </CardTitle>
              <p className="text-muted-foreground line-clamp-2 mb-2">
                {book.author}
              </p>
            </CardContent>

            <CardFooter className="flex items-center justify-between p-4 pt-0">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={book.user_profile_image_url}
                    alt={book.username}
                  />
                  <AvatarFallback>
                    {book.username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Badge variant="secondary">{book.username}</Badge>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center text-muted-foreground py-16">
          No public books available
        </div>
      )}
    </div>
  );
};

export default PublicBooksGrid;
