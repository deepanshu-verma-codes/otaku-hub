"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Maximize, Minimize, ChevronLeft, ChevronRight } from "lucide-react";
import Loader from "@/components/Loader";
import { useState, useRef, useEffect } from "react";

const decodeBase64Url = (str: string) => {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    return decodeURIComponent(atob(base64));
  } catch (e) {
    return null;
  }
};

export default function MangaReaderPage() {
  const params = useParams();
  const router = useRouter();
  
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const readerRef = useRef<HTMLDivElement>(null);

  // ID is url-safe base64 encoded title
  const encodedId = params.id as string;
  const title = encodedId ? decodeBase64Url(encodedId) : null;

  const { data: readerData, isLoading, isError } = useQuery({
    queryKey: ["manga-reader", title, selectedChapterId],
    queryFn: async () => {
      if (!title) return null;
      let url = `/api/manga/read?title=${encodeURIComponent(title)}`;
      if (selectedChapterId) {
        url += `&chapterId=${encodeURIComponent(selectedChapterId)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load manga");
      return res.json();
    },
    enabled: !!title,
    staleTime: Infinity,
  });

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Compute Next/Prev Chapters
  let prevChapterId = null;
  let nextChapterId = null;
  if (readerData?.allChapters && readerData.chapterId) {
    const currentIndex = readerData.allChapters.findIndex((c: any) => c.id === readerData.chapterId);
    if (currentIndex > 0) prevChapterId = readerData.allChapters[currentIndex - 1].id;
    if (currentIndex < readerData.allChapters.length - 1) nextChapterId = readerData.allChapters[currentIndex + 1].id;
  }

  return (
    <div ref={readerRef} className="w-full bg-[#0c0a09] min-h-screen text-[#ffffff] overflow-y-auto">
      {/* Reader Header */}
      <div className={`fixed top-0 left-0 right-0 p-4 bg-[#0c0a09]/90 backdrop-blur-md z-50 flex items-center justify-between border-b border-[#2a2a2a] transition-transform ${isFullscreen ? '-translate-y-full' : 'translate-y-0'}`}>
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#a3a3a3] hover:text-[#ffffff] transition-colors tracking-[0.15px] font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> BACK
        </button>
        {readerData && (
          <div className="text-center flex-1 mx-4 truncate flex flex-col items-center">
            <h1 className="text-[16px] font-serif font-normal truncate">{readerData.title}</h1>
            
            {readerData.allChapters && readerData.allChapters.length > 0 ? (
              <div className="flex items-center gap-3 mt-1">
                <button 
                  onClick={() => prevChapterId && setSelectedChapterId(prevChapterId)}
                  disabled={!prevChapterId}
                  className="text-[#a3a3a3] hover:text-[#ffffff] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <select 
                  className="bg-[#1a1a1a] text-[#ffffff] border border-[#2a2a2a] rounded px-2 py-1 text-[12px] uppercase tracking-[0.5px] outline-none cursor-pointer"
                  value={readerData.chapterId || ""}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                >
                  {readerData.allChapters.map((ch: any) => (
                    <option key={ch.id} value={ch.id}>
                      Chapter {ch.chapterNumber}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={() => nextChapterId && setSelectedChapterId(nextChapterId)}
                  disabled={!nextChapterId}
                  className="text-[#a3a3a3] hover:text-[#ffffff] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-[12px] text-[#a3a3a3] tracking-[0.5px] uppercase mt-1">CHAPTER {readerData.chapter}</p>
            )}
          </div>
        )}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleFullscreen}
            className="text-[#a3a3a3] hover:text-[#ffffff] transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className={`w-full flex flex-col items-center justify-center min-h-screen ${!isFullscreen ? 'pt-24 pb-20' : 'pt-0 pb-0'}`}>
        {isLoading ? (
          <div className="flex flex-col items-center">
            <Loader />
            <p className="mt-8 tracking-[0.5px] text-[#a3a3a3] text-[14px] uppercase">
              Fetching Pages...
            </p>
          </div>
        ) : isError || !readerData || !readerData.pages ? (
          <div className="text-center py-32 text-[#dc2626]">
            <p>We couldn't find English chapters for this manga right now.</p>
            <p className="text-[#a3a3a3] text-[14px] mt-4 max-w-md mx-auto">
              This can happen if the manga is unlicensed or hasn't been translated yet.
            </p>
            <button 
              onClick={() => router.back()}
              className="mt-8 border border-[#2a2a2a] px-6 py-2 rounded-full hover:bg-[#ffffff] hover:text-[#0c0a09] transition-colors"
            >
              GO BACK
            </button>
          </div>
        ) : (
          <div className="w-full max-w-[900px] flex flex-col items-center">
            {readerData.pages.map((url: string, index: number) => (
              <img 
                key={`${readerData.chapterId}-${index}`}
                src={url} 
                alt={`Page ${index + 1}`}
                referrerPolicy="no-referrer"
                className="w-full object-contain bg-[#1a1a1a] block"
                loading={index < 3 ? "eager" : "lazy"}
              />
            ))}
            
            <div className="py-24 text-center flex flex-col items-center">
              <p className="text-[#a3a3a3] tracking-[0.5px] text-[14px] uppercase mb-8">End of Chapter</p>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => prevChapterId && setSelectedChapterId(prevChapterId)}
                  disabled={!prevChapterId}
                  className="border border-[#2a2a2a] px-6 py-3 rounded-full hover:bg-[#ffffff] hover:text-[#0c0a09] transition-colors tracking-[0.5px] uppercase text-[12px] font-medium disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#a3a3a3] disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button 
                  onClick={() => router.back()}
                  className="border border-[#2a2a2a] px-8 py-3 rounded-full hover:bg-[#ffffff] hover:text-[#0c0a09] transition-colors tracking-[0.5px] uppercase text-[14px]"
                >
                  Return to Library
                </button>
                <button 
                  onClick={() => nextChapterId && setSelectedChapterId(nextChapterId)}
                  disabled={!nextChapterId}
                  className="border border-[#ffffff] bg-[#ffffff] text-[#0c0a09] px-6 py-3 rounded-full hover:bg-transparent hover:text-[#ffffff] transition-colors tracking-[0.5px] uppercase text-[12px] font-medium disabled:opacity-30 disabled:hover:bg-[#ffffff] disabled:hover:text-[#0c0a09] disabled:cursor-not-allowed"
                >
                  Next Chapter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Floating Fullscreen button when in fullscreen */}
      {isFullscreen && (
        <button 
          onClick={toggleFullscreen}
          className="fixed bottom-6 right-6 p-3 bg-[#0c0a09]/80 backdrop-blur-md border border-[#2a2a2a] rounded-full text-[#a3a3a3] hover:text-[#ffffff] transition-colors z-50 shadow-lg"
          title="Exit Fullscreen"
        >
          <Minimize className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
