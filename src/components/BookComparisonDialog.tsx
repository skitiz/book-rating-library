import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Book } from "./AddBookDialog";

interface Comparison {
  winner: Book;
  loser: Book;
}

interface BookComparisonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newBook: Book;
  existingBooks: Book[];
  onUpdateRatings: (comparisons: Comparison[]) => void;
}

const BookComparisonDialog: React.FC<BookComparisonDialogProps> = ({
  isOpen,
  onClose,
  newBook,
  existingBooks,
  onUpdateRatings,
}) => {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sameGenreBooks = existingBooks.filter(
    (book) => book.genre === newBook.genre && book.id !== newBook.id
  );

  const handleChoice = (winner: Book, loser: Book) => {
    const newComparisons = [...comparisons, { winner, loser }];
    setComparisons(newComparisons);

    if (currentIndex < sameGenreBooks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onUpdateRatings(newComparisons);
      onClose();
    }
  };

  if (sameGenreBooks.length === 0 || currentIndex >= sameGenreBooks.length) {
    return null;
  }

  const comparedBook = sameGenreBooks[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compare Books</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Which book is better?</p>
          <div className="flex justify-between mt-4">
            <Button onClick={() => handleChoice(newBook, comparedBook)}>
              {newBook.title}
            </Button>
            <Button onClick={() => handleChoice(comparedBook, newBook)}>
              {comparedBook.title}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookComparisonDialog;
