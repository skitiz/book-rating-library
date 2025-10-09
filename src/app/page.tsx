"use client";

import { useState, useEffect } from "react";

interface BookData {
  title: string;
  author: string;
  coverUrl?: string;
}

interface ShowData {
  title: string;
  platform: string;
  genre: string;
}

export default function Home() {
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [isLoadingBook, setIsLoadingBook] = useState(true);

  const ISBN = "9780063373860";

  // Placeholder data for Currently Watching - can be replaced with API later
  const showData: ShowData = {
    title: "The Bear",
    platform: "Hulu",
    genre: "Drama",
  };

  useEffect(() => {
    const fetchBookData = async () => {
      setIsLoadingBook(true);
      try {
        const response = await fetch(
          `https://openlibrary.org/isbn/${ISBN}.json`
        );
        const data = await response.json();

        // Get the first author key if available
        const authorKey = data.authors?.[0]?.key;
        let authorName = "Unknown Author";

        // If we have an author key, fetch the author details
        if (authorKey) {
          const authorResponse = await fetch(
            `https://openlibrary.org${authorKey}.json`
          );
          const authorData = await authorResponse.json();
          authorName = authorData.name;
        }

        setBookData({
          title: data.title,
          author: authorName,
          coverUrl: `https://covers.openlibrary.org/b/isbn/${ISBN}-M.jpg`,
        });
      } catch (error) {
        console.error("Error fetching book data:", error);
      } finally {
        setIsLoadingBook(false);
      }
    };

    fetchBookData();
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

        {/* Currently Watching & Reading Section */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-neutral-800 mb-8">
            Currently Enjoying
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Currently Watching */}
            <div className="group">
              <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-4">
                Watching
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-neutral-100 rounded flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-neutral-900 mb-1">
                      {showData.title}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {showData.platform} • {showData.genre}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Currently Reading */}
            <div className="group">
              <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-4">
                Reading
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow duration-200">
                {isLoadingBook ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-8 h-8 border-3 border-neutral-300 border-t-neutral-600 rounded-full animate-spin"></div>
                      <p className="text-sm text-neutral-400">
                        Loading book...
                      </p>
                    </div>
                  </div>
                ) : bookData ? (
                  <div className="flex flex-col items-center">
                    {bookData.coverUrl && (
                      <div className="mb-4 group-hover:scale-105 transition-transform duration-200">
                        <img
                          src={bookData.coverUrl}
                          alt={bookData.title}
                          className="w-28 h-auto rounded shadow-md"
                        />
                      </div>
                    )}
                    <p className="text-base font-medium text-neutral-900 text-center mb-1">
                      {bookData.title}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {bookData.author}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48">
                    <p className="text-sm text-neutral-400">
                      Unable to load book data
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
