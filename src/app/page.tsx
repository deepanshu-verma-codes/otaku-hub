"use client";

import { useQuery } from "@tanstack/react-query";
import { Button, buttonVariants } from "@/components/ui/button";
import { Play, Newspaper, Quote, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Loader from "@/components/Loader";

export default function Home() {
  const { data: trendingImages, isLoading: imagesLoading } = useQuery({
    queryKey: ["homepage-images"],
    queryFn: async () => {
      const res = await fetch("https://nekos.best/api/v2/waifu?amount=4");
      const data = await res.json();
      return data.results || [];
    },
  });

  const { data: latestVideos, isLoading: videosLoading } = useQuery({
    queryKey: ["homepage-videos"],
    queryFn: async () => {
      const res = await fetch("/api/videos?limit=3");
      const data = await res.json();
      return data.items || [];
    },
  });

  const { data: latestNews, isLoading: newsLoading } = useQuery({
    queryKey: ["homepage-news"],
    queryFn: async () => {
      const res = await fetch("/api/news?page=1&limit=2");
      const data = await res.json();
      return data.items || [];
    },
  });



  const staticQuotes = [
    { quote: "Fear is not evil. It tells you what your weakness is.", character: "Gildarts Clive", anime: "Fairy Tail" },
    { quote: "Whatever you do, enjoy it to the fullest. That is the secret of life.", character: "Rider", anime: "Fate/Zero" }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5f5] pb-32">
      
      {/* 1. Hero Section */}
      <section className="relative w-full text-center min-h-[80vh] flex flex-col justify-center pt-32 pb-12 overflow-hidden">
        {/* Background Video Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#e7e5e4]">
          {/* Off-white overlay for readability */}
          <div className="absolute inset-0 bg-[#f5f5f5]/40 z-10"></div>
          {/* Seamless fade to page background at bottom */}
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#f5f5f5] to-transparent z-20"></div>
          {/* Anime Background Video Loop */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover opacity-60 mix-blend-multiply"
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="w-full max-w-[1440px] mx-auto px-[40px] relative z-30">
          <div className="space-y-4">
            <h1 className="text-[48px] font-serif font-light tracking-[-0.96px] md:text-[64px] font-serif font-light tracking-[-1.92px] font-normal tracking-[-0.96px]  text-[#0c0a09] leading-[0.9]">
              ANIME<br/>UNIVERSE
            </h1>
          <p className="mt-8 text-[16px] md:text-[18px] text-[#4e4e4e] max-w-2xl mx-auto  tracking-[0.15px]">
            Discover breathtaking wallpapers, watch trending AMVs, and read iconic anime quotes all in one place.
          </p>
        </div>
        <div className="flex justify-center gap-6 pt-12 relative z-20">
          <Link href="/gallery" className="bg-[#0c0a09] text-[#ffffff] hover:bg-[#292524] px-8 py-3  tracking-[0.15px] text-[16px] font-medium transition-colors rounded-full">
            ENTER GALLERY
          </Link>
          <Link href="/videos" className="bg-transparent border border-[#e7e5e4] text-[#0c0a09] hover:bg-white/50 px-8 py-3  tracking-[0.15px] text-[16px] font-medium transition-colors rounded-full">
            WATCH VIDEOS
          </Link>
        </div>


        </div>
      </section>

      <div className="w-full max-w-[1440px] mx-auto mt-32 space-y-40 px-[40px]">
        
        {/* 2. Trending Anime Images */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#e7e5e4] pb-6">
            <h2 className="text-[32px] font-serif font-light tracking-[-0.32px] font-serif font-light tracking-[-0.32px] md:text-[36px] font-serif font-light tracking-[-0.36px] font-normal  text-[#0c0a09] leading-[1.19]">TRENDING WALLPAPERS</h2>
            <Link href="/gallery" className={buttonVariants({ variant: "ghost", className: " tracking-[0.15px]" })}>
              VIEW ALL
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {imagesLoading 
              ? <div className="col-span-full py-12"><Loader /></div>
              : trendingImages?.map((img: any, i: number) => (
                  <Link href="/gallery" key={i} className="group relative aspect-[3/4] bg-[#ffffff] shadow-sm border border-[#e7e5e4] overflow-hidden cursor-pointer rounded-2xl hover:border-white transition-colors">
                    <img 
                      src={img.url} 
                      alt={img.artist_name || "Anime Art"} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-[#f5f5f5]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <p className="text-[#0c0a09]  font-normal truncate w-full text-[14px] tracking-normal">
                        ART BY {img.artist_name || "UNKNOWN"}
                      </p>
                    </div>
                  </Link>
                ))
            }
          </div>
        </section>

        {/* 3. Featured Videos */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#e7e5e4] pb-6">
            <h2 className="text-[32px] font-serif font-light tracking-[-0.32px] font-serif font-light tracking-[-0.32px] md:text-[36px] font-serif font-light tracking-[-0.36px] font-normal  text-[#0c0a09] leading-[1.19]">LATEST VIDEOS</h2>
            <Link href="/videos" className={buttonVariants({ variant: "ghost", className: " tracking-[0.15px]" })}>
              VIEW ALL
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videosLoading
              ? <div className="col-span-full py-12"><Loader /></div>
              : latestVideos?.map((video: any, i: number) => (
                  <Link href={`/videos/${video.id}`} key={i} className="group relative aspect-video bg-[#ffffff] shadow-sm border border-[#e7e5e4] overflow-hidden cursor-pointer rounded-2xl hover:border-white transition-colors">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-[#f5f5f5]/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-[#0c0a09] flex items-center justify-center">
                        <Play className="w-6 h-6 text-[#ffffff] ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <h3 className="text-[14px] text-[#0c0a09]  font-normal line-clamp-1 w-[75%] tracking-normal">
                        {video.title}
                      </h3>
                      <span className="bg-[#f5f5f5] border border-[#e7e5e4] px-3 py-1 text-[10px] tracking-normal font-normal text-[#0c0a09] rounded-full">
                        {video.duration}
                      </span>
                    </div>
                  </Link>
                ))
            }
          </div>
        </section>

        {/* 4. Latest News */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#e7e5e4] pb-6">
            <h2 className="text-[32px] font-serif font-light tracking-[-0.32px] font-serif font-light tracking-[-0.32px] md:text-[36px] font-serif font-light tracking-[-0.36px] font-normal  text-[#0c0a09] leading-[1.19]">LATEST NEWS</h2>
            <Link href="/news" className={buttonVariants({ variant: "ghost", className: " tracking-[0.15px]" })}>
              VIEW ALL
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsLoading 
              ? <div className="col-span-full py-12"><Loader /></div>
              : latestNews?.map((news: any, i: number) => (
                  <a 
                    key={i} 
                    href={news.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-[#ffffff] shadow-sm border border-[#e7e5e4] p-8 flex flex-col justify-between hover:border-[#0c0a09] transition-colors rounded-xl"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <Newspaper className="w-5 h-5 text-[#0c0a09]" />
                        <span className="text-[10px] text-[#0c0a09] bg-[#f5f5f5] px-3 py-1  tracking-normal border border-[#e7e5e4] rounded-full">
                          {news.categories?.[0] || "UPDATE"}
                        </span>
                      </div>
                      <h3 className="text-[20px] text-[#0c0a09]  leading-[1.4] mb-4 group-hover:text-[#0c0a09] transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-[#4e4e4e] text-[14px] line-clamp-2">
                        {news.contentSnippet}
                      </p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-[#e7e5e4] flex items-center justify-between">
                       <span className="text-[#494949] text-[12px]  tracking-normal">
                        {new Date(news.pubDate).toLocaleDateString()}
                      </span>
                      <span className="text-[#0c0a09] text-[12px]  tracking-normal flex items-center gap-2 group-hover:text-[#0c0a09] transition-colors">
                        READ <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </a>
                ))
            }
          </div>
        </section>



        {/* 6. Iconic Quotes */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#e7e5e4] pb-6">
            <h2 className="text-[32px] font-serif font-light tracking-[-0.32px] font-serif font-light tracking-[-0.32px] md:text-[36px] font-serif font-light tracking-[-0.36px] font-normal  text-[#0c0a09] leading-[1.19]">ICONIC QUOTES</h2>
            <Link href="/quotes" className={buttonVariants({ variant: "ghost", className: " tracking-[0.15px]" })}>
              VIEW ALL
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {staticQuotes.map((quote, i) => (
              <div key={i} className="bg-[#ffffff] border border-[#e7e5e4] p-10 relative group hover:border-[#e7e5e4] transition-colors rounded-xl">
                <Quote className="w-12 h-12 text-[#0c0a09] opacity-20 absolute top-6 left-6" />
                <div className="relative z-10 pt-8">
                  <p className="text-[#0c0a09] text-[18px] md:text-[24px] font-serif font-light  leading-[1.5] tracking-wide mb-8">
                    "{quote.quote}"
                  </p>
                  <div className="border-t border-[#e7e5e4] pt-6">
                    <p className="text-[#0c0a09] text-[14px]  tracking-normal font-medium">
                      {quote.character}
                    </p>
                    <p className="text-[#4e4e4e] text-[12px]  tracking-normal mt-1">
                      {quote.anime}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Call to Action */}
        <section className="relative w-full py-24 md:py-32 overflow-hidden border border-[#e7e5e4] bg-[#ffffff] rounded-[2rem]">
          {/* Atmospheric Pastel Orbs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-[2rem]">
            <div className="absolute -top-[50%] -left-[20%] w-[100%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>
            <div className="absolute -bottom-[50%] -right-[20%] w-[100%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-100/40 via-transparent to-transparent rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto text-center px-6">
            <h2 className="text-[36px] md:text-[56px] font-serif font-light tracking-[-1.12px] text-[#0c0a09] leading-[1.1] mb-6">
              CURATE YOUR<br />EXPERIENCE
            </h2>
            <p className="text-[#4e4e4e] text-[16px] md:text-[18px] tracking-[0.15px] leading-relaxed mb-12">
              Join our community to save your favorite wallpapers, curate your personal video library, and immerse yourself in the universe.
            </p>
            <Link href="/auth/signup" className="inline-flex items-center justify-center bg-[#0c0a09] text-[#ffffff] hover:bg-[#292524] px-8 py-4 tracking-[0.15px] text-[15px] font-medium transition-all rounded-full hover:scale-105 active:scale-100">
              CREATE YOUR ACCOUNT
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
