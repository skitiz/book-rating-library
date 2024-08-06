import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Book {
  id?: string;
  title: string;
  author: string;
  rating: number;
  genre: string;
  coverUrl: string;
}

interface AddBookDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: Book) => void;
  onCompare: (book: Book) => void;
}

const AddBookDialog: React.FC<AddBookDialogProps> = ({
  isOpen,
  onClose,
  onAddBook,
  onCompare,
}) => {
  const [newBook, setNewBook] = useState<Book>({
    title: "",
    author: "",
    rating: 0,
    genre: "",
    coverUrl: "",
  });
  const genres = ["Fiction", "Non-fiction", "Mystery", "Sci-Fi", "Romance"];

  const [open, setOpen] = useState(false);

  const [selectedGenre, setSelectedGenre] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newBookWithId: Book = { ...newBook, id: Date.now().toString() };
    onAddBook(newBookWithId);
    onClose();
    setNewBook({
      title: "",
      author: "",
      rating: 0,
      genre: "",
      coverUrl: "",
    });
    setSelectedGenre("");
    onCompare(newBookWithId);
  };

  const isFormValid = () => {
    return (
      newBook.title.trim() !== "" &&
      newBook.author.trim() !== "" &&
      newBook.rating > 0 &&
      newBook.genre.trim() !== "" &&
      newBook.coverUrl.trim() !== ""
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newBook.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewBook({ ...newBook, title: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="author" className="text-right">
                Author
              </Label>
              <Input
                id="author"
                value={newBook.author}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewBook({ ...newBook, author: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">
                Rating
              </Label>
              <Input
                id="rating"
                type="number"
                value={newBook.rating}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewBook({ ...newBook, rating: parseInt(e.target.value) })
                }
                className="col-span-3"
                required
                min="1"
                max="5"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="genres" className="text-right">
                Genres
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {selectedGenre
                      ? genres.find((framework) => framework === selectedGenre)
                      : "Select genre..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandList>
                      <CommandEmpty>No Genres Found</CommandEmpty>
                      <CommandGroup>
                        {genres.map((genre) => (
                          <CommandItem
                            key={genre}
                            value={genre}
                            onSelect={(currentValue: string) => {
                              setSelectedGenre(
                                currentValue === selectedGenre
                                  ? ""
                                  : currentValue
                              );
                              setNewBook((prevBook) => ({
                                ...prevBook,
                                genre: currentValue,
                              }));
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                genre === selectedGenre
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {genre}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coverUrl" className="text-right">
                Cover URL
              </Label>
              <Input
                id="coverUrl"
                value={newBook.coverUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewBook({ ...newBook, coverUrl: e.target.value })
                }
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!isFormValid()}>
              Add Book
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookDialog;
