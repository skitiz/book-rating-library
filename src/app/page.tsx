"use client";

import { useState, useEffect } from "react";

interface BookData {
  title: string;
  author: string;
  coverUrl?: string;
}

export default function Home() {
  const [bookData, setBookData] = useState<BookData | null>(null);

  const ISBN = "9780063373860";

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(`https://openlibrary.org/isbn/${ISBN}.json`);
        const data = await response.json();
        
        // Get the first author key if available
        const authorKey = data.authors?.[0]?.key;
        let authorName = "Unknown Author";

        // If we have an author key, fetch the author details
        if (authorKey) {
          const authorResponse = await fetch(`https://openlibrary.org${authorKey}.json`);
          const authorData = await authorResponse.json();
          authorName = authorData.name;
        }
        
        setBookData({
          title: data.title,
          author: authorName,
          coverUrl: `https://covers.openlibrary.org/b/isbn/${ISBN}-M.jpg`
        });
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBookData();
  }, []);

  return (
    <main className="flex justify-start pl-[10%] md:pl-[20%]">
      <div className="md:max-w-[420px] m-6 md:m-20 text-neutral font-[3800] mt-[100px] lg:mt-[180px]">
        <div>
          <h1 className="text-neutral-700 font-semibold pb-6">kshitij bantupalli jaeger</h1>
          <p className="leading-[25px] pb-4 text-neutral-500">Senior software engineer at Mclean, VA working for Capital One.</p>
          <p className="leading-[25px] pb-4 text-neutral-500 w-11/12">
            I\'ve worked for various companies like Washington Post, Lowes and Caterpillar. 
          </p>
          <p className="leading-[25px] pb-4 text-neutral-500 w-11/12">
            You can find out more about me <a className="text-neutral-900 border-b hover:text-neutral-400" href="https://www.linkedin.com/in/kshitijbantupalli/">here</a>, read my resume <a className="text-neutral-900 border-b hover:text-neutral-400" href="/resume.pdf" download>here</a>, or view my Github <a className="text-neutral-900 border-b hover:text-neutral-400" href="https://github.com/skitiz">here</a>.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-8">
          <div className="text-center">
            <h2 className="text-neutral-700 font-semibold pb-4">Currently Watching</h2>
            <div className="text-neutral-500">
              <p className="leading-[25px]">Show Title</p>
              <p className="text-sm">Platform • Genre</p>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-neutral-700 font-semibold pb-4">Currently Reading</h2>
            <div className="text-neutral-500 flex flex-col items-center">
              {bookData ? (
                <>
                  {bookData.coverUrl && (
                    <img 
                      src={bookData.coverUrl} 
                      alt={bookData.title}
                      className="w-32 h-auto mb-3 rounded shadow-sm"
                    />
                  )}
                  <p className="leading-[25px] font-medium">{bookData.title}</p>
                  <p className="text-sm text-neutral-400">{bookData.author}</p>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
