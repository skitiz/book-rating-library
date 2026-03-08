"use client";

import { useState, useEffect, useCallback } from "react";
import { updateElo } from "@/lib/elo";
import CompareCard from "@/components/CompareCard";
import GameReviewDialog, { RankedGame } from "@/components/GameReviewDialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const STORAGE_KEY = "elo-games";

const SEED_GAMES: RankedGame[] = [
  {
    id: "1",
    title: "Elden Ring",
    platform: "PC",
    coverUrl: "https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg",
    elo: 1000,
    comparisonCount: 0,
  },
  {
    id: "2",
    title: "The Last of Us Part II",
    platform: "PS5",
    coverUrl: "https://upload.wikimedia.org/wikipedia/en/4/4f/TLOU_P2_Box_Art_2.png",
    elo: 1000,
    comparisonCount: 0,
  },
  {
    id: "3",
    title: "Hollow Knight",
    platform: "PC",
    coverUrl: "https://upload.wikimedia.org/wikipedia/en/3/37/Hollow_Knight_cover.jpg",
    elo: 1000,
    comparisonCount: 0,
  },
  {
    id: "4",
    title: "Celeste",
    platform: "Switch",
    coverUrl: "https://upload.wikimedia.org/wikipedia/en/0/0f/Celeste_box_art_full.png",
    elo: 1000,
    comparisonCount: 0,
  },
];

function pickPair(games: RankedGame[]): [RankedGame, RankedGame] | null {
  if (games.length < 2) return null;
  const sorted = [...games].sort((a, b) => a.comparisonCount - b.comparisonCount);
  const a = sorted[0];
  const candidates = games.filter((g) => g.id !== a.id);
  const b = candidates[Math.floor(Math.random() * candidates.length)];
  return [a, b];
}

export default function GamesPage() {
  const [games, setGames] = useState<RankedGame[]>([]);
  const [view, setView] = useState<"compare" | "rankings">("compare");
  const [pair, setPair] = useState<[RankedGame, RankedGame] | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editGame, setEditGame] = useState<RankedGame | undefined>(undefined);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed: RankedGame[] = stored ? JSON.parse(stored) : [];
      setGames(parsed.length > 0 ? parsed : SEED_GAMES);
    } catch {
      setGames(SEED_GAMES);
    }
  }, []);

  useEffect(() => {
    if (games.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
    }
  }, [games]);

  useEffect(() => {
    setPair(pickPair(games));
  }, [games]);

  const handleVote = useCallback((winnerId: string, loserId: string) => {
    setGames((prev) => {
      const next = prev.map((g) => ({ ...g }));
      const winner = next.find((g) => g.id === winnerId)!;
      const loser = next.find((g) => g.id === loserId)!;
      const [newWinnerElo, newLoserElo] = updateElo(winner.elo, loser.elo);
      winner.elo = newWinnerElo;
      winner.comparisonCount += 1;
      loser.elo = newLoserElo;
      loser.comparisonCount += 1;
      return next;
    });
  }, []);

  const handleSaveGame = (game: RankedGame) => {
    setGames((prev) => {
      const exists = prev.find((g) => g.id === game.id);
      if (exists) return prev.map((g) => (g.id === game.id ? game : g));
      return [...prev, game];
    });
    setEditGame(undefined);
  };

  const sorted = [...games].sort((a, b) => b.elo - a.elo);

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
                Game Ranker
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                ELO-based rankings with structured reviews.
              </p>
            </div>
            <div className="flex gap-2">
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
                + Add Game
              </Button>
            </div>
          </div>
        </div>

        {/* Compare view */}
        {view === "compare" && (
          <div className="flex flex-col items-center gap-8">
            {pair ? (
              <>
                <p className="text-neutral-600 text-sm font-medium">
                  Which game is better?
                </p>
                <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full">
                  <CompareCard
                    title={pair[0].title}
                    subtitle={pair[0].platform}
                    coverUrl={pair[0].coverUrl}
                    onClick={() => handleVote(pair[0].id, pair[1].id)}
                  />
                  <span className="text-xl font-bold text-neutral-300">vs</span>
                  <CompareCard
                    title={pair[1].title}
                    subtitle={pair[1].platform}
                    coverUrl={pair[1].coverUrl}
                    onClick={() => handleVote(pair[1].id, pair[0].id)}
                  />
                </div>
                <p className="text-xs text-neutral-400">
                  {games.reduce((sum, g) => sum + g.comparisonCount, 0) / 2} comparisons total
                </p>
              </>
            ) : (
              <p className="text-neutral-500">Add at least 2 games to start comparing.</p>
            )}
          </div>
        )}

        {/* Rankings view */}
        {view === "rankings" && (
          <div className="space-y-3">
            {sorted.map((game, index) => (
              <div key={game.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                <div
                  className="flex items-center gap-4 p-4 hover:bg-neutral-50 cursor-pointer transition-colors"
                  onClick={() => setExpandedId(expandedId === game.id ? null : game.id)}
                >
                  <span className="text-2xl font-bold text-neutral-200 w-8 text-center shrink-0">
                    {index + 1}
                  </span>
                  <div className="w-12 h-16 rounded overflow-hidden bg-neutral-100 shrink-0">
                    {game.coverUrl ? (
                      <img
                        src={game.coverUrl}
                        alt={game.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://via.placeholder.com/48x64/e5e5e5/737373?text=${encodeURIComponent(game.title[0])}`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 text-lg font-bold">
                        {game.title[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900 truncate">{game.title}</p>
                    <p className="text-sm text-neutral-500">{game.platform}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="inline-block bg-neutral-100 text-neutral-700 text-sm font-mono font-medium px-3 py-1 rounded-full">
                        {game.elo}
                      </span>
                      <p className="text-xs text-neutral-400 mt-1">{game.comparisonCount} comparisons</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditGame(game);
                      }}
                      className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors px-2 py-1 rounded hover:bg-neutral-100"
                    >
                      Edit
                    </button>
                    <span className="text-neutral-300 text-xs">
                      {expandedId === game.id ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {/* Expandable review */}
                {expandedId === game.id && game.review && (
                  <div className="border-t border-neutral-100 px-6 py-4 grid gap-3">
                    {game.review.loved && (
                      <div>
                        <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Loved</p>
                        <p className="text-sm text-neutral-700">{game.review.loved}</p>
                      </div>
                    )}
                    {game.review.hated && (
                      <div>
                        <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Hated</p>
                        <p className="text-sm text-neutral-700">{game.review.hated}</p>
                      </div>
                    )}
                    {game.review.feltWeird && (
                      <div>
                        <p className="text-xs font-semibold text-amber-500 uppercase tracking-wide mb-1">Felt Weird</p>
                        <p className="text-sm text-neutral-700">{game.review.feltWeird}</p>
                      </div>
                    )}
                    {!game.review.loved && !game.review.hated && !game.review.feltWeird && (
                      <p className="text-sm text-neutral-400 italic">No review written yet.</p>
                    )}
                  </div>
                )}
                {expandedId === game.id && !game.review && (
                  <div className="border-t border-neutral-100 px-6 py-4">
                    <p className="text-sm text-neutral-400 italic">No review written yet.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Game Dialog */}
      <GameReviewDialog
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleSaveGame}
      />

      {/* Edit Game Dialog */}
      {editGame && (
        <GameReviewDialog
          isOpen={true}
          onClose={() => setEditGame(undefined)}
          onSave={handleSaveGame}
          existing={editGame}
        />
      )}
    </main>
  );
}
