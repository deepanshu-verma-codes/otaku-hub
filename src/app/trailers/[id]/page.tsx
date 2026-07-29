"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { Heart, MessageSquare, Share2, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Loader from "@/components/Loader";

export default function TrailerPlayerPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("trailer"); // "trailer" | "episodes"
  const [activeEpisode, setActiveEpisode] = useState(1);

  const { data: trailer, isLoading } = useQuery({
    queryKey: ["trailer", id],
    queryFn: async () => {
      const res = await fetch(`/api/trailers/${id}`);
      return res.json();
    },
  });

  const { data: streamData, isLoading: isStreamLoading } = useQuery({
    queryKey: ["stream", trailer?.title, 1, activeEpisode],
    queryFn: async () => {
      if (!trailer?.title) return null;
      const res = await fetch(`/api/anime/stream?title=${encodeURIComponent(trailer.title)}&s=1&e=${activeEpisode}`);
      if (!res.ok) return { error: true };
      return res.json();
    },
    enabled: !!trailer?.title && activeTab === "episodes",
  });

  const { data: recommendedTrailers } = useQuery({
    queryKey: ["trailers", "recommended"],
    queryFn: async () => {
      // Offset randomly to get random recommendations
      const res = await fetch(`/api/trailers?page=2&limit=5`);
      return res.json();
    },
  });

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await fetch("/api/favorites");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!session,
  });

  const toggleFavorite = useMutation({
    mutationFn: async ({ type, action, item }: any) => {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, action, item }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const isFavorited = trailer ? favorites?.trailers?.some((f: any) => f.id === trailer.id) : false;

  const handleLike = () => {
    if (!session) return alert("Please sign in to save trailers.");
    const action = isFavorited ? "remove" : "add";
    toggleFavorite.mutate({ type: "trailer", action, item: trailer });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-32 bg-[#f5f5f5] min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!trailer || !trailer.trailerUrl) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-[#f5f5f5] min-h-screen">
        <h1 className="text-[24px] font-serif font-light  text-[#dc2626] tracking-normal mb-4">TRAILER NOT FOUND</h1>
        <Link href="/trailers" className="text-[#0c0a09]  tracking-normal text-[14px]">RETURN TO TRAILERS</Link>
      </div>
    );
  }

  const totalEpisodes = trailer.episodes || 12;
  const episodesList = Array.from({ length: totalEpisodes }, (_, i) => i + 1);

  return (
    <div className="max-w-[1440px] mx-auto px-[40px] py-12 bg-[#f5f5f5] min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          
          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-[#e7e5e4]">
            <button 
              onClick={() => setActiveTab("trailer")}
              className={`pb-4 px-2 text-[16px] tracking-[0.15px] font-medium transition-colors ${activeTab === "trailer" ? "text-[#0c0a09] border-b-2 border-[#0c0a09]" : "text-[#4e4e4e] hover:text-[#0c0a09]"}`}
            >
              TRAILER
            </button>
            <button 
              onClick={() => setActiveTab("episodes")}
              className={`pb-4 px-2 text-[16px] tracking-[0.15px] font-medium transition-colors ${activeTab === "episodes" ? "text-[#0c0a09] border-b-2 border-[#0c0a09]" : "text-[#4e4e4e] hover:text-[#0c0a09]"}`}
            >
              EPISODES
            </button>
          </div>

          {/* Trailer Player */}
          <div className="aspect-video w-full bg-[#000000] shadow-sm border border-[#e7e5e4] overflow-hidden rounded-2xl relative">
            {activeTab === "trailer" ? (
              trailer.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.youtubeId}?autoplay=1&mute=0`}
                  title={trailer.title}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#ffffff]">
                  <p className="font-serif tracking-wide text-[18px]">TRAILER UNAVAILABLE</p>
                </div>
              )
            ) : isStreamLoading ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#ffffff]">
                <Loader />
                <p className="mt-4 text-[#a8a29e] text-[14px] font-medium tracking-[0.15px]">Locating episode stream...</p>
              </div>
            ) : streamData?.embedUrl ? (
              <iframe
                src={streamData.embedUrl}
                title={`Episode ${activeEpisode}`}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#ffffff] p-8 text-center">
                <h2 className="text-[#ffffff] font-serif tracking-wide text-[20px] mb-2">EPISODE UNAVAILABLE</h2>
                <p className="text-[#a8a29e] text-[14px]">We couldn't locate a free stream for this episode.</p>
              </div>
            )}
          </div>

          {/* Episodes List */}
          {activeTab === "episodes" && (
            <div className="bg-[#ffffff] border border-[#e7e5e4] rounded-2xl p-6 shadow-sm">
              <h3 className="text-[20px] font-serif font-light text-[#0c0a09] mb-6">SEASON 1</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {episodesList.map((ep) => (
                  <button
                    key={ep}
                    onClick={() => setActiveEpisode(ep)}
                    className={`py-3 rounded-xl border text-[14px] font-medium transition-all ${
                      activeEpisode === ep 
                        ? "bg-[#0c0a09] text-[#ffffff] border-[#0c0a09]" 
                        : "bg-[#f5f5f5] text-[#4e4e4e] border-[#e7e5e4] hover:border-[#0c0a09] hover:text-[#0c0a09]"
                    }`}
                  >
                    EP {ep}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trailer Info */}
          <div className="space-y-6">
            <h1 className="text-[32px] font-serif font-light tracking-[-0.32px] md:text-[32px] font-serif font-light tracking-[-0.32px] font-serif font-light tracking-[-0.32px] font-normal  text-[#0c0a09] leading-[1.1] tracking-wide">
              {trailer.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7e5e4] pb-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 border border-[#e7e5e4] rounded-2xl">
                  <AvatarImage src="/logo.jpg" />
                  <AvatarFallback className="rounded-2xl bg-[#ffffff] shadow-sm text-[#0c0a09]">O</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-normal  text-[#0c0a09] tracking-normal">OTAKUHUB TRAILERS</h3>
                  <p className="text-[12px]  tracking-normal text-[#4e4e4e] mt-1">OFFICIAL SYNDICATE</p>
                </div>
                <Button className="ml-4 bg-[#0c0a09] text-[#ffffff] hover:bg-[#292524] rounded-2xl  tracking-[0.15px] font-medium">
                  SUBSCRIBE
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleLike}
                  variant="outline" 
                  className={`rounded-2xl border-[#e7e5e4] shadow-sm text-[12px] gap-2 transition-colors ${isFavorited ? 'bg-[#dc2626] text-[#ffffff] border-[#dc2626] hover:bg-[#b91c1c] hover:text-[#ffffff]' : 'bg-transparent hover:bg-[#ffffff] hover:text-[#0c0a09] text-[#0c0a09]'}`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} /> {isFavorited ? 'LIKED' : 'LIKE'}
                </Button>
                <Button variant="outline" className="rounded-2xl border-[#e7e5e4] bg-transparent hover:bg-[#ffffff] shadow-sm hover:text-[#0c0a09] text-[#0c0a09]  tracking-normal text-[12px] gap-2 transition-colors">
                  <Share2 className="w-4 h-4" /> SHARE
                </Button>
                <Button variant="outline" className="rounded-2xl border-[#e7e5e4] bg-transparent hover:bg-[#ffffff] shadow-sm hover:text-[#0c0a09] text-[#0c0a09]  tracking-normal text-[12px] gap-2 transition-colors">
                  <BookmarkPlus className="w-4 h-4" /> SAVE
                </Button>
              </div>
            </div>

            <div className="bg-[#ffffff] shadow-sm border border-[#e7e5e4] p-6 text-[14px] text-[#4e4e4e] rounded-xl">
              <p className="font-medium text-[#0c0a09] mb-4  tracking-normal">{trailer.views} VIEWS • {trailer.category}</p>
              <p className="leading-[1.8] line-clamp-6">{trailer.synopsis || "No description provided."}</p>
              <p className="mt-4 text-[#0c0a09] cursor-pointer hover:underline  tracking-normal text-[12px]">
                #ANIME #{trailer.category.toUpperCase().replace(/\s/g, '')} #TRAILER
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="pt-8 space-y-8">
            <h3 className="text-[24px] font-serif font-light  font-normal text-[#0c0a09] flex items-center gap-3 tracking-normal border-b border-[#e7e5e4] pb-4">
              <MessageSquare className="w-6 h-6 text-[#0c0a09]" /> COMMENTS
            </h3>
            
            <div className="flex gap-4">
              <Avatar className="w-12 h-12 rounded-2xl border border-[#e7e5e4]">
                <AvatarFallback className="bg-[#ffffff] shadow-sm text-[#0c0a09] rounded-2xl">YOU</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <Textarea placeholder="ADD A COMMENT..." className="bg-[#f5f5f5] border border-[#e7e5e4] focus-visible:ring-0 focus-visible:border-[#0c0a09] rounded-2xl  tracking-normal text-[#0c0a09] h-24" />
                <div className="flex justify-end">
                  <Button className="bg-[#0c0a09] text-[#ffffff] hover:bg-[#292524] rounded-2xl  tracking-[0.15px] px-8 font-medium">
                    POST
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Dummy Comment */}
            <div className="flex gap-4 pt-8">
              <Avatar className="w-12 h-12 rounded-2xl border border-[#e7e5e4]">
                <AvatarFallback className="bg-[#ffffff] shadow-sm text-[#0c0a09] rounded-2xl">A1</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-[14px] text-[#0c0a09]  tracking-normal">GHOST_IN_THE_SHELL</span>
                  <span className="text-[10px] text-[#494949]  tracking-normal">2 DAYS AGO</span>
                </div>
                <p className="text-[#4e4e4e] mt-2 text-[14px] leading-[1.6]">THE ANIMATION QUALITY IN THIS IS ABSOLUTELY INSANE. CANNOT WAIT FOR THE FULL RELEASE.</p>
                <div className="flex items-center gap-6 mt-4">
                  <button className="flex items-center gap-2 text-[#494949] hover:text-[#0c0a09] transition-colors text-[12px]  tracking-normal font-medium">
                    <Heart className="w-4 h-4" /> 234
                  </button>
                  <button className="text-[#494949] hover:text-[#0c0a09] transition-colors text-[12px]  tracking-normal font-medium">REPLY</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Trailers Sidebar */}
        <div className="space-y-6">
          <h3 className="text-[24px] font-serif font-light  font-normal text-[#0c0a09] tracking-normal border-b border-[#e7e5e4] pb-4">
            UP NEXT
          </h3>
          
          <div className="flex flex-col gap-6">
            {!recommendedTrailers?.items ? (
               [1,2,3,4,5].map(i => <div key={i} className="w-full h-24 bg-[#ffffff] shadow-sm animate-pulse border border-[#e7e5e4] rounded-xl" />)
            ) : (
              recommendedTrailers.items.map((recTrailer: any) => (
                <Link href={`/trailers/${recTrailer.id}`} key={recTrailer.id} className="flex gap-4 group cursor-pointer">
                  <div className="relative w-40 aspect-video rounded-2xl overflow-hidden bg-[#ffffff] shadow-sm border border-[#e7e5e4] flex-shrink-0">
                    <img 
                      src={recTrailer.thumbnail} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      alt={recTrailer.title}
                    />
                  </div>
                  <div className="flex flex-col py-1">
                    <h4 className="text-[14px] font-normal text-[#0c0a09]  tracking-normal group-hover:text-[#0c0a09] transition-colors line-clamp-2 leading-[1.4]">
                      {recTrailer.title}
                    </h4>
                    <span className="text-[10px] text-[#4e4e4e]  tracking-normal mt-2">{recTrailer.views} VIEWS</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
