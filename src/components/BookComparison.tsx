import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from "./AddBookDialog";

interface GenreData {
  count: number;
  averageRating: number;
}

interface GenreComparison {
  [genre: string]: GenreData;
}

const BookComparison = ({ books }: { books: Book[] }) => {
  const [genreComparison, setGenreComparison] = useState<GenreComparison>({});

  useEffect(() => {
    const comparison: GenreComparison = books.reduce(
      (acc: GenreComparison, book: Book) => {
        if (!acc[book.genre]) {
          acc[book.genre] = { count: 0, averageRating: 0 };
        }
        acc[book.genre].count++;
        acc[book.genre].averageRating += book.rating;
        return acc;
      },
      {}
    );

    Object.keys(comparison).forEach((genre) => {
      comparison[genre].averageRating /= comparison[genre].count;
    });

    setGenreComparison(comparison);
  }, [books]);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Genre Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(genreComparison).map(
          ([genre, data]: [string, GenreData]) => (
            <div key={genre} className="mb-4">
              <h3 className="text-lg font-semibold">{genre}</h3>
              <p>Books: {data.count}</p>
              <p>Average Rating: {data.averageRating.toFixed(2)}</p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default BookComparison;
