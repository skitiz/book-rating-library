"use client";

import { useState, useEffect, useCallback } from "react";
import { updateElo } from "@/lib/elo";
import CompareCard from "@/components/CompareCard";
import { AdminGate } from "@/components/AdminGate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RankedBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  elo: number;
  comparisonCount: number;
}

const STORAGE_KEY = "elo-books";
const PAIRS_KEY = "elo-books-pairs";

const SEED_BOOKS: RankedBook[] = [
  { id: "1", title: "The Dragon Republic", author: "R.F. Kuang", isbn: "9780062662637", elo: 1000, comparisonCount: 0 },
  { id: "2", title: "Yellowface", author: "R.F. Kuang", isbn: "9780063373860", elo: 1000, comparisonCount: 0 },
  { id: "3", title: "The Poppy War", author: "R.F. Kuang", isbn: "9780062662583", elo: 1000, comparisonCount: 0 },
  { id: "4", title: "Bloodmarked", author: "Tracy Deonn", isbn: "9781534441637", elo: 1000, comparisonCount: 0 },
];

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("-");
}

function totalPairs(n: number): number {
  return (n * (n - 1)) / 2;
}

function pickNextPair(items: RankedBook[], completedPairs: Set<string>): [RankedBook, RankedBook] | null {
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const key = pairKey(items[i].id, items[j].id);
      if (!completedPairs.has(key)) return [items[i], items[j]];
    }
  }
  return null;
}

function coverUrl(isbn: string) {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
}

export default function BooksPage() {
  const [books, setBooks] = useState<RankedBook[]>([]);
  const [completedPairs, setCompletedPairs] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"compare" | "rankings">("rankings");
  const [pair, setPair] = useState<[RankedBook, RankedBook] | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newBook, setNewBook] = useState({ title: "", author: "", isbn: "" });
  const [isAdmin, setIsAdmin] = useState(false);

  // Load from localStorage or seed
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed: RankedBook[] = stored ? JSON.parse(stored) : [];
      const data = parsed.length > 0 ? parsed : SEED_BOOKS;
      setBooks(data);

      const storedPairs = localStorage.getItem(PAIRS_KEY);
      const parsedPairs: string[] = storedPairs ? JSON.parse(storedPairs) : [];
      setCompletedPairs(new Set(parsedPairs));
    } catch {
      setBooks(SEED_BOOKS);
      setCompletedPairs(new Set());
    }
  }, []);

  // Persist on change
  useEffect(() => {
    if (books.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  }, [books]);

  useEffect(() => {
    localStorage.setItem(PAIRS_KEY, JSON.stringify([...completedPairs]));
  }, [completedPairs]);

  // Pick next pair whenever books or completedPairs change
  useEffect(() => {
    setPair(pickNextPair(books, completedPairs));
  }, [books, completedPairs]);

  const handleVote = useCallback(
    (winnerId: string, loserId: string) => {
      const key = pairKey(winnerId, loserId);
      setCompletedPairs((prev) => new Set([...prev, key]));
      setBooks((prev) => {
        const next = prev.map((b) => ({ ...b }));
        const winner = next.find((b) => b.id === winnerId)!;
        const loser = next.find((b) => b.id === loserId)!;
        const [newWinnerElo, newLoserElo] = updateElo(winner.elo, loser.elo);
        winner.elo = newWinnerElo;
        winner.comparisonCount += 1;
        loser.elo = newLoserElo;
        loser.comparisonCount += 1;
        return next;
      });
    },
    []
  );

  const handleRerank = () => {
    setCompletedPairs(new Set());
    setBooks((prev) => prev.map((b) => ({ ...b, elo: 1000, comparisonCount: 0 })));
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title.trim() || !newBook.author.trim()) return;
    const book: RankedBook = {
      id: Date.now().toString(),
      title: newBook.title.trim(),
      author: newBook.author.trim(),
      isbn: newBook.isbn.trim(),
      elo: 1000,
      comparisonCount: 0,
    };
    setBooks((prev) => [...prev, book]);
    setNewBook({ title: "", author: "", isbn: "" });
    setAddOpen(false);
  };

  const sorted = [...books].sort((a, b) => b.elo - a.elo);
  const total = totalPairs(books.length);
  const done = completedPairs.size;
  const rankingComplete = books.length >= 2 && pair === null;

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors mb-4 inline-block"
          >
            ← Home
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
                Book Ranker
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                ELO-based rankings. Pick the better book.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <>
                  <Button
                    variant={view === "compare" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setView("compare")}
                  >
                    Compare
                  </Button>
                  <Button
                    variant={view === "rankings" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setView("rankings")}
                  >
                    Rankings
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setAddOpen(true)}>
                    + Add Book
                  </Button>
                </>
              )}
              {!isAdmin && (
                <span className="text-sm text-neutral-500 font-medium">Rankings</span>
              )}
              <AdminGate onAdminChange={setIsAdmin} />
            </div>
          </div>
        </div>

        {/* Compare view (admin only) */}
        {isAdmin && view === "compare" && (
          <div className="flex flex-col items-center gap-8">
            {rankingComplete ? (
              <div className="text-center py-12">
                <p className="text-lg font-semibold text-neutral-800 mb-2">Ranking complete!</p>
                <p className="text-sm text-neutral-500 mb-6">All {total} comparisons done.</p>
                <Button variant="outline" onClick={handleRerank}>Re-rank</Button>
              </div>
            ) : pair ? (
              <>
                <p className="text-neutral-600 text-sm font-medium">
                  Which book is better?
                </p>
                <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full">
                  <CompareCard
                    title={pair[0].title}
                    subtitle={pair[0].author}
                    coverUrl={coverUrl(pair[0].isbn)}
                    onClick={() => handleVote(pair[0].id, pair[1].id)}
                  />
                  <span className="text-xl font-bold text-neutral-300">vs</span>
                  <CompareCard
                    title={pair[1].title}
                    subtitle={pair[1].author}
                    coverUrl={coverUrl(pair[1].isbn)}
                    onClick={() => handleVote(pair[1].id, pair[0].id)}
                  />
                </div>
                <p className="text-xs text-neutral-400">
                  {done} of {total} comparisons
                </p>
              </>
            ) : (
              <p className="text-neutral-500">Add at least 2 books to start comparing.</p>
            )}
          </div>
        )}

        {/* Rankings view */}
        {(!isAdmin || view === "rankings") && (
          <div className="space-y-3">
            {sorted.map((book, index) => (
              <div
                key={book.id}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors"
              >
                <span className="text-2xl font-bold text-neutral-200 w-8 text-center shrink-0">
                  {index + 1}
                </span>
                <div className="w-12 h-16 rounded overflow-hidden bg-neutral-100 shrink-0">
                  <img
                    src={coverUrl(book.isbn)}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/48x64/e5e5e5/737373?text=${encodeURIComponent(book.title[0])}`;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 truncate">{book.title}</p>
                  <p className="text-sm text-neutral-500">{book.author}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block bg-neutral-100 text-neutral-700 text-sm font-mono font-medium px-3 py-1 rounded-full">
                    {book.elo}
                  </span>
                  <p className="text-xs text-neutral-400 mt-1">{book.comparisonCount} comparisons</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Book Dialog (admin only) */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Book</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddBook}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="b-title" className="text-right">Title</Label>
                <Input
                  id="b-title"
                  value={newBook.title}
                  onChange={(e) => setNewBook((p) => ({ ...p, title: e.target.value }))}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="b-author" className="text-right">Author</Label>
                <Input
                  id="b-author"
                  value={newBook.author}
                  onChange={(e) => setNewBook((p) => ({ ...p, author: e.target.value }))}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="b-isbn" className="text-right">ISBN</Label>
                <Input
                  id="b-isbn"
                  placeholder="e.g. 9780062662637"
                  value={newBook.isbn}
                  onChange={(e) => setNewBook((p) => ({ ...p, isbn: e.target.value }))}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!newBook.title.trim() || !newBook.author.trim()}>
                Add Book
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
