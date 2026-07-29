"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";

export default function AnimePlayerPage() {
  const { id } = useParams();
  
  const [activeSeasonIndex, setActiveSeasonIndex] = useState(0);
  const [activeEpisode, setActiveEpisode] = useState(1);

  const { data: anime, isLoading } = useQuery({
    queryKey: ["animeDetail", id],
    queryFn: async () => {
      const res = await fetch(`/api/anime/${id}`);
      return res.json();
    },
  });

  const activeSeason = anime?.seasons?.[activeSeasonIndex];

  const { data: streamData, isLoading: isStreamLoading } = useQuery({
    queryKey: ["stream", anime?.title, activeSeasonIndex, activeEpisode],
    queryFn: async () => {
      if (!anime?.title) return null;
      const res = await fetch(`/api/anime/stream?title=${encodeURIComponent(anime.title)}&s=${activeSeasonIndex + 1}&e=${activeEpisode}`);
      if (!res.ok) return { error: true };
      return res.json();
    },
    enabled: !!anime?.title,
  });

  if (isLoading) return <div className="flex justify-center py-32 bg-[#f5f5f5] min-h-screen"><Loader /></div>;
  if (!anime) return <div className="text-center py-32 text-red-500">Anime not found.</div>;

  const episodesList = Array.from({ length: activeSeason?.episodes || 12 }, (_, i) => i + 1);

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-20">
      {/* Banner */}
      <div className="w-full h-[40vh] md:h-[50vh] relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#f5f5f5] via-[#f5f5f5]/60 to-transparent z-10" />
        <img src={anime.banner} className="w-full h-full object-cover" alt="Banner" />
      </div>

      <div className="max-w-[1440px] mx-auto px-[24px] md:px-[40px] relative z-20 -mt-32">
        <div className="flex flex-col md:flex-row gap-8">
          <img 
            src={anime.thumbnail} 
            alt={anime.title} 
            className="w-48 md:w-64 aspect-[2/3] object-cover rounded-2xl shadow-xl border-4 border-[#f5f5f5] bg-[#ffffff]"
          />
          <div className="mt-4 md:mt-32">
            <h1 className="text-[32px] md:text-[48px] font-serif font-light text-[#0c0a09] leading-tight mb-4">{anime.title}</h1>
            <p className="text-[#4e4e4e] max-w-3xl leading-relaxed">{anime.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mt-16">
          {/* Main Content (Player & Episodes) */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Player */}
            <div className="aspect-video w-full bg-[#000000] shadow-sm border border-[#e7e5e4] overflow-hidden rounded-2xl relative">
              {isStreamLoading ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#ffffff]">
                  <Loader />
                  <p className="mt-4 text-[#a8a29e] text-[14px] font-medium tracking-[0.15px]">Locating episode stream...</p>
                </div>
              ) : streamData?.embedUrl ? (
                <iframe
                  src={streamData.embedUrl}
                  title={`Episode ${activeEpisode}`}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#ffffff] p-8 text-center">
                  <h2 className="text-[#ffffff] font-serif tracking-wide text-[20px] mb-2">EPISODE UNAVAILABLE</h2>
                  <p className="text-[#a8a29e] text-[14px]">We couldn't locate a free stream for this episode.</p>
                </div>
              )}
            </div>

            {/* Episodes Grid */}
            <div className="bg-[#ffffff] border border-[#e7e5e4] rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[24px] font-serif font-light text-[#0c0a09]">
                  {activeSeason.title.toUpperCase()} EPISODES
                </h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
                {episodesList.map((ep) => (
                  <button
                    key={ep}
                    onClick={() => setActiveEpisode(ep)}
                    className={`py-3 md:py-4 rounded-xl border text-[14px] md:text-[16px] font-medium transition-all ${
                      activeEpisode === ep 
                        ? "bg-[#0c0a09] text-[#ffffff] border-[#0c0a09] shadow-md scale-105" 
                        : "bg-[#f5f5f5] text-[#4e4e4e] border-[#e7e5e4] hover:border-[#0c0a09] hover:text-[#0c0a09]"
                    }`}
                  >
                    EP {ep}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Seasons List */}
          <div className="space-y-6">
            <h3 className="text-[20px] font-serif font-light text-[#0c0a09] border-b border-[#e7e5e4] pb-4">
              AVAILABLE SEASONS
            </h3>
            <div className="flex flex-col gap-4">
              {anime.seasons.map((season: any, idx: number) => (
                <button
                  key={season.id}
                  onClick={() => {
                    setActiveSeasonIndex(idx);
                    setActiveEpisode(1);
                  }}
                  className={`flex items-center gap-4 p-3 rounded-2xl border transition-all text-left ${
                    activeSeasonIndex === idx
                      ? "bg-[#ffffff] border-[#0c0a09] shadow-md ring-1 ring-[#0c0a09]"
                      : "bg-[#f5f5f5] border-[#e7e5e4] hover:border-[#0c0a09] hover:bg-[#ffffff]"
                  }`}
                >
                  <img src={season.cover} alt={season.title} className="w-16 h-24 object-cover rounded-lg border border-[#e7e5e4]" />
                  <div>
                    <h4 className={`font-medium text-[14px] leading-tight mb-1 ${activeSeasonIndex === idx ? "text-[#0c0a09]" : "text-[#4e4e4e]"}`}>
                      {season.title}
                    </h4>
                    <p className="text-[12px] text-[#494949] line-clamp-2 leading-snug">{season.fullTitle}</p>
                    <p className="text-[10px] text-[#0c0a09] mt-2 tracking-widest font-semibold">{season.episodes} EPS</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
