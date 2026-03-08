"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SESSION_KEY = "admin-unlocked";

interface AdminGateProps {
  onAdminChange: (isAdmin: boolean) => void;
}

export function AdminGate({ onAdminChange }: AdminGateProps) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === "true") onAdminChange(true);
  }, [onAdminChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin";
    if (password === expected) {
      sessionStorage.setItem(SESSION_KEY, "true");
      onAdminChange(true);
      setOpen(false);
      setPassword("");
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors px-2 py-1 rounded hover:bg-neutral-100"
        title="Admin login"
      >
        🔒
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Admin Login</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="py-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                autoFocus
              />
              {error && (
                <p className="text-xs text-red-500 mt-2">Incorrect password.</p>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!password.trim()}>
                Unlock
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
