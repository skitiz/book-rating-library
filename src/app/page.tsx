"use client";

import { useState, useEffect } from "react";

interface BookData {
  title: string;
  author: string;
  coverUrl: string;
  isbn: string;
}

// Last 3 books read (front to back)
const RECENT_BOOKS = [
  { isbn: "9780063373860", title: "Yellowface", author: "R.F. Kuang" },
  { isbn: "9780062662569", title: "The Poppy War", author: "R.F. Kuang" },
  { isbn: "9781534441637", title: "Bloodmarked", author: "Tracy Deonn" },
];

export default function Home() {
  const [booksData, setBooksData] = useState<BookData[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);

  useEffect(() => {
    const fetchBooksData = async () => {
      setIsLoadingBooks(true);
      try {
        const bookPromises = RECENT_BOOKS.map(async (book) => {
          try {
            const response = await fetch(
              `https://openlibrary.org/isbn/${book.isbn}.json`
            );
            const data = await response.json();

            // Get the first author key if available
            const authorKey = data.authors?.[0]?.key;
            let authorName = book.author; // fallback to our data

            // If we have an author key, fetch the author details
            if (authorKey) {
              try {
                const authorResponse = await fetch(
                  `https://openlibrary.org${authorKey}.json`
                );
                const authorData = await authorResponse.json();
                authorName = authorData.name;
              } catch {
                // Use fallback author name
              }
            }

            return {
              title: data.title || book.title,
              author: authorName,
              coverUrl: `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`,
              isbn: book.isbn,
            };
          } catch (error) {
            console.error(`Error fetching book ${book.isbn}:`, error);
            // Return fallback data
            return {
              title: book.title,
              author: book.author,
              coverUrl: `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`,
              isbn: book.isbn,
            };
          }
        });

        const books = await Promise.all(bookPromises);
        setBooksData(books);
      } catch (error) {
        console.error("Error fetching books data:", error);
      } finally {
        setIsLoadingBooks(false);
      }
    };

    fetchBooksData();
  }, []);

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Introduction Section */}
        <section className="mb-16 md:mb-20">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6 tracking-tight">
            kshitij bantupalli jaeger
          </h1>

          <div className="space-y-4 text-neutral-600 leading-relaxed max-w-2xl">
            <p>
              Senior software engineer at Mclean, VA working for Capital One.
            </p>
            <p>
              I&apos;ve worked for various companies like Washington Post, Lowes
              and Caterpillar.
            </p>
            <p>
              You can find out more about me{" "}
              <a
                className="text-neutral-900 border-b border-neutral-300 hover:border-neutral-900 hover:text-neutral-700 transition-colors duration-200"
                href="https://www.linkedin.com/in/kshitijbantupalli/"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              , read my resume{" "}
              <a
                className="text-neutral-900 border-b border-neutral-300 hover:border-neutral-900 hover:text-neutral-700 transition-colors duration-200"
                href="/resume.pdf"
                download
              >
                here
              </a>
              , or view my Github{" "}
              <a
                className="text-neutral-900 border-b border-neutral-300 hover:border-neutral-900 hover:text-neutral-700 transition-colors duration-200"
                href="https://github.com/skitiz"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              .
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-neutral-200 mb-16 md:mb-20"></div>

        {/* Recent Reads Section */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-neutral-800 mb-8">
            Recent Reads
          </h2>

          {isLoadingBooks ? (
            <div className="flex items-center justify-center h-[500px]">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-10 h-10 border-4 border-neutral-300 border-t-neutral-600 rounded-full animate-spin"></div>
                <p className="text-sm text-neutral-400">Loading books...</p>
              </div>
            </div>
          ) : booksData.length > 0 ? (
            <div className="flex justify-center items-center py-12">
              {/* Stacked Books Container */}
              <div className="relative w-full max-w-2xl h-[500px] flex items-center justify-center">
                {booksData.map((book, index) => {
                  // Calculate positioning for stacked effect
                  // Front book (index 0) is most prominent
                  // Middle and back books are offset to the left and rotated
                  const baseZIndex = booksData.length - index;
                  const rotation = index === 0 ? 0 : index === 1 ? -6 : -10;
                  const xOffset = index === 0 ? 0 : index === 1 ? -80 : -140;
                  const yOffset = index === 0 ? 0 : index === 1 ? 20 : 30;
                  const scale = index === 0 ? 1 : index === 1 ? 0.92 : 0.88;
                  const opacity = index === 0 ? 1 : index === 1 ? 0.9 : 0.75;

                  return (
                    <div
                      key={book.isbn}
                      className="absolute transition-all duration-500 ease-out cursor-pointer group/book"
                      style={{
                        zIndex: baseZIndex,
                        transform: `translateX(${xOffset}px) translateY(${yOffset}px) rotate(${rotation}deg) scale(${scale})`,
                        opacity,
                      }}
                      onMouseEnter={(e) => {
                        // Bring hovered book to front with dramatic flourish
                        e.currentTarget.style.zIndex = "100";
                        e.currentTarget.style.transform = `translateX(${xOffset}px) translateY(${
                          yOffset - 30
                        }px) rotate(0deg) scale(1.08)`;
                        e.currentTarget.style.opacity = "1";
                      }}
                      onMouseLeave={(e) => {
                        // Return to original position
                        e.currentTarget.style.zIndex = baseZIndex.toString();
                        e.currentTarget.style.transform = `translateX(${xOffset}px) translateY(${yOffset}px) rotate(${rotation}deg) scale(${scale})`;
                        e.currentTarget.style.opacity = opacity.toString();
                      }}
                    >
                      <div className="bg-white rounded-lg shadow-xl border border-neutral-200 overflow-hidden group-hover/book:shadow-2xl group-hover/book:ring-4 group-hover/book:ring-neutral-300/50 transition-all duration-500">
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-52 h-80 object-cover"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback if image fails to load
                            console.error(
                              `Failed to load cover for ${book.title}`
                            );
                            const target = e.target as HTMLImageElement;
                            target.src = `https://via.placeholder.com/208x320/e5e5e5/737373?text=${encodeURIComponent(
                              book.title
                            )}`;
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[500px]">
              <p className="text-sm text-neutral-400">
                Unable to load books data
              </p>
            </div>
          )}

          {/* Book Details Below Stack */}
          {!isLoadingBooks && booksData.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-sm text-neutral-500 mb-2">Most Recent:</p>
              <p className="text-lg font-medium text-neutral-900">
                {booksData[0].title}
              </p>
              <p className="text-sm text-neutral-600">{booksData[0].author}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
