"use client";

import { useState } from "react";
import BookList from "@/components/BookList";
import AddBookDialog from "@/components/AddBookDialog";
import BookComparison from "@/components/BookComparison";
import BookComparisonDialog from "@/components/BookComparisonDialog";
import { Button } from "@/components/ui/button";
import { Book } from "@/components/AddBookDialog";

const initialBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    rating: 4,
    coverUrl: "/covers/great-gatsby.jpg",
    genre: "Fiction",
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    rating: 5,
    coverUrl: "/covers/1984.jpg",
    genre: "Fiction",
  },
  // Add more books as needed
];

const K_FACTOR: number = 32;

const roundToQuarter = (num: number): number => {
  return Math.round(num * 4) / 4;
};

const calculateNewRatings = (
  winner: Book,
  loser: Book
): { winner: number; loser: number } => {
  const expectedScore: number =
    1 / (1 + Math.pow(10, (loser.rating - winner.rating) / 400));
  const change: number = (K_FACTOR * (1 - expectedScore)) / 10;

  return {
    winner: roundToQuarter(Math.min(5, Math.max(1, winner.rating + change))),
    loser: roundToQuarter(Math.min(5, Math.max(1, loser.rating - change))),
  };
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [isAddBookOpen, setIsAddBookOpen] = useState<boolean>(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [newBook, setNewBook] = useState<Book>({
    id: "",
    title: "",
    author: "",
    rating: 0,
    genre: "",
    coverUrl: "",
  });

  const addBook = (book: Book): void => {
    setBooks([...books, book]);
    setNewBook(book);
  };

  const compareBooks = (book: Book): void => {
    setIsComparisonOpen(true);
  };

  const updateRatings = (
    comparisons: { winner: Book; loser: Book }[]
  ): void => {
    const updatedBooks: Book[] = [...books];
    comparisons.forEach(({ winner, loser }) => {
      const newRatings: { winner: number; loser: number } = calculateNewRatings(
        winner,
        loser
      );
      const winnerIndex: number = updatedBooks.findIndex(
        (book) => book.id === winner.id
      );
      const loserIndex: number = updatedBooks.findIndex(
        (book) => book.id === loser.id
      );
      updatedBooks[winnerIndex].rating = newRatings.winner;
      updatedBooks[loserIndex].rating = newRatings.loser;
    });
    setBooks(updatedBooks);
  };

  const onDelete = (id: string): void => {
    setBooks(books.filter((book) => book.id !== id));
  };

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">
        My Book Rating Library
      </h1>
      <Button onClick={() => setIsAddBookOpen(true)} className="mb-4">
        Add Book
      </Button>
      <BookList books={books} onDelete={onDelete} />
      <AddBookDialog
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
        onAddBook={(book: Book) => addBook(book)}
        onCompare={compareBooks}
      />
      <BookComparisonDialog
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        newBook={newBook}
        existingBooks={books}
        onUpdateRatings={updateRatings}
      />
      <BookComparison books={books} />
    </main>
  );
}
