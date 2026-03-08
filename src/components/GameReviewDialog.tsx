"use client";

import { useState } from "react";
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

export interface RankedGame {
  id: string;
  title: string;
  platform: string;
  coverUrl: string;
  elo: number;
  comparisonCount: number;
  review?: {
    loved: string;
    hated: string;
    feltWeird: string;
  };
}

interface GameReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (game: RankedGame) => void;
  existing?: RankedGame;
}

const EMPTY_FORM = {
  title: "",
  platform: "",
  coverUrl: "",
  loved: "",
  hated: "",
  feltWeird: "",
};

export default function GameReviewDialog({
  isOpen,
  onClose,
  onSave,
  existing,
}: GameReviewDialogProps) {
  const [form, setForm] = useState(
    existing
      ? {
          title: existing.title,
          platform: existing.platform,
          coverUrl: existing.coverUrl,
          loved: existing.review?.loved ?? "",
          hated: existing.review?.hated ?? "",
          feltWeird: existing.review?.feltWeird ?? "",
        }
      : EMPTY_FORM
  );

  const set = (field: keyof typeof EMPTY_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const game: RankedGame = existing
      ? {
          ...existing,
          title: form.title,
          platform: form.platform,
          coverUrl: form.coverUrl,
          review: {
            loved: form.loved,
            hated: form.hated,
            feltWeird: form.feltWeird,
          },
        }
      : {
          id: Date.now().toString(),
          title: form.title,
          platform: form.platform,
          coverUrl: form.coverUrl,
          elo: 1000,
          comparisonCount: 0,
          review: {
            loved: form.loved,
            hated: form.hated,
            feltWeird: form.feltWeird,
          },
        };
    onSave(game);
    setForm(EMPTY_FORM);
    onClose();
  };

  const isValid = form.title.trim() !== "" && form.platform.trim() !== "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{existing ? "Edit Game" : "Add Game"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="g-title" className="text-right">Title</Label>
              <Input id="g-title" value={form.title} onChange={set("title")} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="g-platform" className="text-right">Platform</Label>
              <Input id="g-platform" placeholder="PS5, PC, Switch…" value={form.platform} onChange={set("platform")} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="g-cover" className="text-right">Cover URL</Label>
              <Input id="g-cover" placeholder="https://…" value={form.coverUrl} onChange={set("coverUrl")} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="g-loved" className="text-right pt-2">Loved</Label>
              <textarea
                id="g-loved"
                value={form.loved}
                onChange={set("loved")}
                rows={2}
                placeholder="What I loved…"
                className="col-span-3 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="g-hated" className="text-right pt-2">Hated</Label>
              <textarea
                id="g-hated"
                value={form.hated}
                onChange={set("hated")}
                rows={2}
                placeholder="What I hated…"
                className="col-span-3 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="g-weird" className="text-right pt-2">Felt Weird</Label>
              <textarea
                id="g-weird"
                value={form.feltWeird}
                onChange={set("feltWeird")}
                rows={2}
                placeholder="What felt weird / off…"
                className="col-span-3 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!isValid}>
              {existing ? "Save Changes" : "Add Game"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
