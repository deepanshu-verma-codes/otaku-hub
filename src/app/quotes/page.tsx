"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";

export default function BlogPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["quotes", page],
    queryFn: async () => {
      const res = await fetch("https://api.animechan.io/v1/quotes");
      const json = await res.json();
      if (json.status === "error") {
        throw new Error(json.error?.message || "Failed to fetch quotes");
      }
      return json.data || [];
    },
    staleTime: Infinity, // Keep the quotes cached per page
    retry: false, // Don't spam retries if rate limited
  });

  return (
    <div className="max-w-[1440px] mx-auto px-[40px] py-12 bg-[#f5f5f5] min-h-screen">
      <div className="border-b border-[#e7e5e4] pb-6 mb-12">
        <h1 className="text-[36px] font-serif font-light tracking-[-0.36px] font-normal  text-[#0c0a09] leading-[1.19]">
          ANIME QUOTES
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-32 bg-[#f5f5f5]">
          <Loader />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="text-[#dc2626]  tracking-[0.15px] text-[18px] mb-4">
            RATE LIMIT EXCEEDED OR API UNAVAILABLE
          </div>
          <p className="text-[#4e4e4e]  tracking-[0.15px] text-[14px]">
            ANIMECHAN API ALLOWS 5 REQUESTS PER HOUR. PLEASE TRY AGAIN LATER.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {data?.map((quote: any, index: number) => (
            <div 
              key={index}
              className="bg-[#ffffff] shadow-sm border border-[#e7e5e4] p-8 flex flex-col justify-between rounded-2xl hover:border-[#e7e5e4] transition-colors"
            >
              <div>
                <Quote className="w-8 h-8 text-[#0c0a09] mb-6 opacity-80" />
                <p className="text-[18px] text-[#0c0a09] leading-[1.56] mb-8 font-normal italic">
                  "{quote.content}"
                </p>
              </div>
              
              <div className="border-t border-[#e7e5e4] pt-6 flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] text-[#0c0a09]  font-medium tracking-[0.15px]">
                    {quote.character.name}
                  </h3>
                  <p className="text-[#4e4e4e] text-[14px]  mt-1">
                    {quote.anime.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-6 mt-16 pt-8 border-t border-[#e7e5e4]">
        <Button 
          variant="outline" 
          disabled={page === 1 || isLoading}
          onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className=" tracking-[0.15px] gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> PREV
        </Button>
        <span className="text-[#4e4e4e]  tracking-[0.15px] text-[14px]">PAGE {page}</span>
        <Button 
          variant="outline"
          disabled={isLoading || isError}
          onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className=" tracking-[0.15px] gap-2"
        >
          NEXT <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
