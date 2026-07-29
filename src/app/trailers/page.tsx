"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";

export default function TrailersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["trailers", page],
    queryFn: async () => {
      const res = await fetch(`/api/trailers?page=${page}&limit=8`);
      return res.json();
    },
  });

  const trailers = data?.items || [];
  const totalPages = data?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="flex justify-center py-32 bg-[#f5f5f5] min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-[40px] py-12 bg-[#f5f5f5] min-h-screen">
      <div className="border-b border-[#e7e5e4] pb-6 mb-12">
        <h1 className="text-[36px] font-serif font-light tracking-[-0.36px] font-normal  text-[#0c0a09] leading-[1.19]">
          TRAILERS
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {trailers?.map((video: any, index: number) => (
          <Link href={`/trailers/${video.id}`} key={video.id}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative cursor-pointer"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#ffffff] shadow-sm border border-[#e7e5e4] mb-4">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-[#f5f5f5]/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-[#0c0a09]">
                    <Play className="w-8 h-8" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-[#f5f5f5] border border-[#e7e5e4] px-2 py-1 rounded-2xl text-[10px] tracking-[0.225px] font-normal text-[#0c0a09] z-20">
                  {video.duration}
                </div>
              </div>
              <h3 className="text-[18px] font-normal text-[#0c0a09]  group-hover:text-[#3860BE] transition-colors line-clamp-2 leading-[1.56]">
                {video.title}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-[14px]  tracking-[0.15px] text-[#4e4e4e]">
                <span>{video.views} VIEWS</span>
                <span className="text-[#494949]">|</span>
                <span>{video.category}</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-6 mt-16 pt-8 border-t border-[#e7e5e4]">
        <Button 
          variant="outline" 
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          className=" tracking-[0.15px] gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> PREV
        </Button>
        <span className="text-[#4e4e4e]  tracking-[0.15px] text-[14px]">PAGE {page} OF {totalPages}</span>
        <Button 
          variant="outline" 
          disabled={page >= totalPages}
          onClick={() => setPage(p => p + 1)}
          className=" tracking-[0.15px] gap-2"
        >
          NEXT <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
