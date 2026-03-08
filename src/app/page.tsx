"use client";

import Link from "next/link";

// Last 3 books read (front to back)
const RECENT_BOOKS = [
  { isbn: "9780062662637", title: "The Dragon Republic", author: "R.F. Kuang" },
  { isbn: "9780063373860", title: "Yellowface", author: "R.F. Kuang" },
  { isbn: "9780062662583", title: "The Poppy War", author: "R.F. Kuang" },
];

const booksData = RECENT_BOOKS.map((book) => ({
  ...book,
  coverUrl: `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`,
}));

export default function Home() {
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
              Software engineer in McLean, VA. I build things, read a lot, and obsess over FPL.
            </p>
            <p>
              I&apos;ve worked for various companies like Capital One, Washington Post and Lowe&apos;s.
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

          <div className="flex justify-center items-center py-12">
            {/* Stacked Books Container */}
            <div className="relative w-full max-w-2xl h-[380px] flex items-center justify-center">
              {booksData.map((book, index) => {
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
                      e.currentTarget.style.transform = `translateX(${xOffset}px) translateY(${yOffset - 20}px) rotate(${rotation}deg) scale(${scale})`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = `translateX(${xOffset}px) translateY(${yOffset}px) rotate(${rotation}deg) scale(${scale})`;
                    }}
                  >
                    <div className="bg-neutral-50 rounded-lg shadow-xl border border-neutral-200 overflow-hidden group-hover/book:shadow-2xl group-hover/book:ring-4 group-hover/book:ring-neutral-300/50 transition-all duration-500 w-40 h-60 flex items-center justify-center">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/208x320/e5e5e5/737373?text=${encodeURIComponent(book.title)}`;
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Book Details Below Stack */}
          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500 mb-2">Currently Reading:</p>
            <p className="text-lg font-medium text-neutral-900">
              {booksData[0].title}
            </p>
            <p className="text-sm text-neutral-600">{booksData[0].author}</p>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-neutral-200 mb-16 md:mb-20 mt-16 md:mt-20"></div>

        {/* Projects Section */}
        <section className="mb-16 md:mb-20">
          <h2 className="text-xl md:text-2xl font-semibold text-neutral-800 mb-6">
            Projects
          </h2>
          <ul className="space-y-4">
            <li className="flex flex-col gap-1">
              <Link
                href="/books"
                className="text-neutral-900 font-medium border-b border-neutral-300 hover:border-neutral-900 transition-colors duration-200 w-fit"
              >
                Book Ranker
              </Link>
              <p className="text-sm text-neutral-500">
                ELO-based ranking of every book I&apos;ve read.
              </p>
            </li>
            <li className="flex flex-col gap-1">
              <Link
                href="/games"
                className="text-neutral-900 font-medium border-b border-neutral-300 hover:border-neutral-900 transition-colors duration-200 w-fit"
              >
                Game Ranker
              </Link>
              <p className="text-sm text-neutral-500">
                Same mechanic for video games, with structured reviews.
              </p>
            </li>
          </ul>
        </section>

        {/* Divider */}
        <div className="border-t border-neutral-200 mb-16 md:mb-20"></div>

        {/* Writing Section */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-neutral-800 mb-4">
            Writing
          </h2>
          <p className="text-sm text-neutral-400">Coming soon.</p>
        </section>
      </div>
    </main>
  );
}
