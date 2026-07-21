"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { Heart, MessageSquare, Share2, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Loader from "@/components/Loader";

export default function VideoPlayerPage() {
  const { id } = useParams();

  const { data: video, isLoading } = useQuery({
    queryKey: ["video", id],
    queryFn: async () => {
      const res = await fetch(`/api/videos/${id}`);
      return res.json();
    },
  });

  const { data: recommendedVideos } = useQuery({
    queryKey: ["videos", "recommended"],
    queryFn: async () => {
      // Offset randomly to get random recommendations
      const res = await fetch(`/api/videos?page=2&limit=5`);
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-32 bg-[#f5f5f5] min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!video || !video.videoUrl) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-[#f5f5f5] min-h-screen">
        <h1 className="text-[24px] font-serif font-light  text-[#dc2626] tracking-normal mb-4">VIDEO NOT FOUND</h1>
        <Link href="/videos" className="text-[#0c0a09]  tracking-normal text-[14px]">RETURN TO VIDEOS</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-[40px] py-12 bg-[#f5f5f5] min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          
          {/* Video Player */}
          <div className="aspect-video w-full bg-[#000000] shadow-sm border border-[#e7e5e4] overflow-hidden rounded-2xl relative">
            {video.youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&mute=0`}
                title={video.title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#ffffff]">
                <p className="font-serif tracking-wide text-[18px]">TRAILER UNAVAILABLE</p>
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="space-y-6">
            <h1 className="text-[32px] font-serif font-light tracking-[-0.32px] md:text-[32px] font-serif font-light tracking-[-0.32px] font-serif font-light tracking-[-0.32px] font-normal  text-[#0c0a09] leading-[1.1] tracking-wide">
              {video.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7e5e4] pb-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 border border-[#e7e5e4] rounded-2xl">
                  <AvatarImage src="/logo.svg" />
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
                <Button variant="outline" className="rounded-2xl border-[#e7e5e4] bg-transparent hover:bg-[#ffffff] shadow-sm hover:text-[#0c0a09] text-[#0c0a09]  tracking-normal text-[12px] gap-2 transition-colors">
                  <Heart className="w-4 h-4" /> LIKE
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
              <p className="font-medium text-[#0c0a09] mb-4  tracking-normal">{video.views} VIEWS • {video.category}</p>
              <p className="leading-[1.8] line-clamp-6">{video.synopsis || "No description provided."}</p>
              <p className="mt-4 text-[#0c0a09] cursor-pointer hover:underline  tracking-normal text-[12px]">
                #ANIME #{video.category.toUpperCase().replace(/\s/g, '')} #TRAILER
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

        {/* Recommended Videos Sidebar */}
        <div className="space-y-6">
          <h3 className="text-[24px] font-serif font-light  font-normal text-[#0c0a09] tracking-normal border-b border-[#e7e5e4] pb-4">
            UP NEXT
          </h3>
          
          <div className="flex flex-col gap-6">
            {!recommendedVideos?.items ? (
               [1,2,3,4,5].map(i => <div key={i} className="w-full h-24 bg-[#ffffff] shadow-sm animate-pulse border border-[#e7e5e4] rounded-xl" />)
            ) : (
              recommendedVideos.items.map((recVideo: any) => (
                <Link href={`/videos/${recVideo.id}`} key={recVideo.id} className="flex gap-4 group cursor-pointer">
                  <div className="relative w-40 aspect-video rounded-2xl overflow-hidden bg-[#ffffff] shadow-sm border border-[#e7e5e4] flex-shrink-0">
                    <img 
                      src={recVideo.thumbnail} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      alt={recVideo.title}
                    />
                  </div>
                  <div className="flex flex-col py-1">
                    <h4 className="text-[14px] font-normal text-[#0c0a09]  tracking-normal group-hover:text-[#0c0a09] transition-colors line-clamp-2 leading-[1.4]">
                      {recVideo.title}
                    </h4>
                    <span className="text-[10px] text-[#4e4e4e]  tracking-normal mt-2">{recVideo.views} VIEWS</span>
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
