import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Book } from "@/components/AddBookDialog";
import { X } from "lucide-react";

interface BookListProps {
  books: Book[];
  onDelete: (id: string) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onDelete }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <Card key={book.id} className="flex flex-col h-full relative">
          <button
            onClick={() => onDelete(book.id)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            aria-label="Delete book"
          >
            <X size={20} />
          </button>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src={book.coverUrl} alt={`Cover of ${book.title}`} />
              <AvatarFallback>{book.title[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-grow min-w-0">
              <CardTitle>{book.title}</CardTitle>
              <p className="text-sm text-muted-foreground truncate">
                {book.author}
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-end">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge>{book.genre}</Badge>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge>Rating: {book.rating}/5</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookList;
