"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";

export default function AnimePage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["anime", page],
    queryFn: async () => {
      const res = await fetch(`/api/anime?page=${page}&limit=12`);
      return res.json();
    },
  });

  const animes = data?.items || [];
  const totalPages = data?.totalPages || 1;

  if (isLoading) return <div className="flex justify-center py-32 bg-[#f5f5f5] min-h-screen"><Loader /></div>;

  return (
    <div className="max-w-[1440px] mx-auto px-[40px] py-12 bg-[#f5f5f5] min-h-screen">
      <div className="border-b border-[#e7e5e4] pb-6 mb-12">
        <h1 className="text-[36px] font-serif font-light tracking-[-0.36px] text-[#0c0a09] leading-[1.19]">
          ANIME SERIES
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {animes.map((anime: any, index: number) => (
          <Link href={`/anime/${anime.id}`} key={anime.id}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
              className="group relative cursor-pointer"
            >
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#ffffff] shadow-sm border border-[#e7e5e4] mb-4">
                <img src={anime.thumbnail} alt={anime.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-[#0c0a09]/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                  <Play className="w-10 h-10 text-[#ffffff]" />
                </div>
              </div>
              <h3 className="text-[16px] font-medium text-[#0c0a09] group-hover:text-[#3860BE] transition-colors line-clamp-2 leading-[1.4]">
                {anime.title}
              </h3>
              <p className="text-[12px] tracking-[0.15px] text-[#4e4e4e] mt-1 uppercase">
                {anime.episodes} EPS • {anime.format}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center items-center gap-6 mt-16 pt-8 border-t border-[#e7e5e4]">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="tracking-[0.15px] gap-2 rounded-2xl">
          <ChevronLeft className="w-4 h-4" /> PREV
        </Button>
        <span className="text-[#4e4e4e] tracking-[0.15px] text-[14px]">PAGE {page} OF {totalPages}</span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="tracking-[0.15px] gap-2 rounded-2xl">
          NEXT <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
