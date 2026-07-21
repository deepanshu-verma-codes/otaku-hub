"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Newspaper, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";
import Link from "next/link";

const encodeBase64Url = (str: string) => {
  return btoa(encodeURIComponent(str))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export default function NewsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["news", page],
    queryFn: async () => {
      const res = await fetch(`/api/news?page=${page}&limit=8`);
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json();
    },
    staleTime: Infinity,
  });

  const newsItems = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="max-w-[1440px] mx-auto px-[40px] py-12 bg-[#f5f5f5] min-h-screen">
      <div className="border-b border-[#e7e5e4] pb-6 mb-12 flex items-end justify-between gap-6 flex-wrap">
        <h1 className="text-[36px] font-serif font-light tracking-[-0.36px] font-normal  text-[#0c0a09] leading-[1.19]">
          LATEST NEWS
        </h1>
        <p className="text-[#4e4e4e]  tracking-[0.15px] mb-2 text-[14px]">
          SOURCED FROM ANIME NEWS NETWORK
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-32 bg-[#f5f5f5]">
          <Loader />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="text-[#dc2626]  tracking-[0.15px] text-[18px] mb-4">
            ERROR FETCHING NEWS
          </div>
          <p className="text-[#4e4e4e]  tracking-[0.15px] text-[14px]">
            COULD NOT REACH ANIME NEWS NETWORK RSS. PLEASE TRY AGAIN LATER.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsItems.map((item: any, index: number) => (
            <Link 
              key={index}
              href={`/news/${encodeBase64Url(item.link)}`}
              className="bg-[#ffffff] shadow-sm border border-[#e7e5e4] p-8 flex flex-col justify-between rounded-2xl hover:border-black cursor-pointer transition-colors group text-left block"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Newspaper className="w-6 h-6 text-[#0c0a09]" />
                  <span className="text-[10px] text-[#0c0a09] bg-[#ffffff] shadow-sm px-3 py-1  tracking-normal border border-[#e7e5e4] rounded-full">
                    {item.categories && item.categories.length > 0 ? item.categories[0] : "NEWS"}
                  </span>
                </div>
                
                <h2 className="text-[20px] text-[#0c0a09] leading-[1.4] mb-4 font-normal  group-hover:text-[#0c0a09] transition-colors">
                  {item.title}
                </h2>
                
                <p className="text-[#4e4e4e] text-[14px] leading-[1.6] line-clamp-3 mb-8">
                  {item.contentSnippet}
                </p>
              </div>
              
              <div className="border-t border-[#e7e5e4] pt-6 flex items-center justify-between">
                <span className="text-[#494949] text-[12px]  tracking-normal">
                  {new Date(item.pubDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="text-[#0c0a09] text-[12px]  tracking-normal group-hover:text-[#0c0a09] transition-colors flex items-center gap-2">
                  READ FULL <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-6 mt-16 pt-8 border-t border-[#e7e5e4]">
        <Button 
          variant="outline" 
          disabled={page === 1 || isLoading}
          onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className=" tracking-[0.15px] gap-2 rounded-2xl"
        >
          <ChevronLeft className="w-4 h-4" /> PREV
        </Button>
        <span className="text-[#4e4e4e]  tracking-[0.15px] text-[14px]">
          PAGE {page} {totalPages > 1 && `OF ${totalPages}`}
        </span>
        <Button 
          variant="outline"
          disabled={page >= totalPages || isLoading || isError}
          onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className=" tracking-[0.15px] gap-2 rounded-2xl"
        >
          NEXT <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

    </div>
  );
}
