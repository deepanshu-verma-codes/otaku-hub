"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, BookOpen, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const encodeBase64Url = (str: string) => {
  return btoa(encodeURIComponent(str))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export default function MangaPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("POPULARITY_DESC");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);


  const { data, isLoading, isError } = useQuery({
    queryKey: ["manga", page, debouncedSearch, genre, sort],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        sort: sort
      });
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (genre) params.append("genre", genre);

      const res = await fetch(`/api/manga?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch manga");
      return res.json();
    },
    staleTime: 60000,
  });

  const mangaList = data?.items || [];
  const totalPages = data?.totalPages || 1;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center min-h-screen bg-[#f5f5f5]">
        <div className="text-[#dc2626]  tracking-[0.15px] text-[18px] mb-4">
          ERROR FETCHING MANGA
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-[40px] py-12 bg-[#f5f5f5] min-h-screen">
      <div className="border-b border-[#e7e5e4] pb-6 mb-12">
        <h1 className="text-[36px] font-serif font-light tracking-[-0.36px] font-normal  text-[#0c0a09] leading-[1.19]">
          MANGA LIBRARY
        </h1>
        <p className="text-[#4e4e4e]  tracking-normal text-[14px] mt-2">
          EXPLORE THE MOST POPULAR MANGA TITLES
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4e4e4e] w-4 h-4" />
          <Input 
            placeholder="Search manga..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 bg-[#ffffff] border-[#e7e5e4] rounded-2xl"
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value);
              setPage(1);
            }}
            className="h-12 px-4 rounded-2xl border border-[#e7e5e4] bg-[#ffffff] text-[#0c0a09] text-[14px] outline-none focus:ring-2 focus:ring-[#0c0a09] min-w-[140px]"
          >
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Adventure">Adventure</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Horror">Horror</option>
            <option value="Mecha">Mecha</option>
            <option value="Music">Music</option>
            <option value="Mystery">Mystery</option>
            <option value="Psychological">Psychological</option>
            <option value="Romance">Romance</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Slice of Life">Slice of Life</option>
            <option value="Sports">Sports</option>
            <option value="Supernatural">Supernatural</option>
            <option value="Thriller">Thriller</option>
          </select>
          <select 
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="h-12 px-4 rounded-2xl border border-[#e7e5e4] bg-[#ffffff] text-[#0c0a09] text-[14px] outline-none focus:ring-2 focus:ring-[#0c0a09] min-w-[140px]"
          >
            <option value="POPULARITY_DESC">Most Popular</option>
            <option value="TRENDING_DESC">Trending</option>
            <option value="SCORE_DESC">Highest Rated</option>
            <option value="START_DATE_DESC">Newest</option>
            <option value="UPDATED_AT_DESC">Recently Updated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col h-full bg-[#ffffff] p-2 rounded-2xl border border-[#e7e5e4]">
              <Skeleton className="aspect-[3/4] rounded-xl mb-4 w-full" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <div className="flex gap-2 mt-auto">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4 rounded-full" />
              </div>
            </div>
          ))
        ) : mangaList.map((manga: any, index: number) => (
          <Link 
            key={manga.id}
            href={`/manga/${encodeBase64Url(manga.title)}`}
            className="group relative cursor-pointer flex flex-col block"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col h-full"
            >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#ffffff] shadow-sm border border-[#e7e5e4] mb-4">
              <img 
                src={manga.thumbnail} 
                alt={manga.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-[#f5f5f5]/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col items-center justify-center p-6 text-center">
                <BookOpen className="w-8 h-8 text-[#0c0a09] mb-4" />
                <p className="text-[#0c0a09] text-[12px]  tracking-normal leading-[1.6] line-clamp-5">
                  {manga.synopsis}
                </p>
              </div>
              <div className="absolute top-3 left-3 bg-[#f5f5f5] border border-[#e7e5e4] px-2 py-1 rounded-2xl text-[10px] tracking-[0.225px] font-normal text-[#0c0a09] z-20 ">
                {manga.chapters !== 'Ongoing' ? `${manga.chapters} CH` : 'ONGOING'}
              </div>
            </div>
            
            <h3 className="text-[18px] font-normal text-[#0c0a09]  group-hover:text-[#0c0a09] transition-colors line-clamp-2 leading-[1.4] mb-2">
              {manga.title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-2 mt-auto">
              <span className="text-[12px]  tracking-[0.15px] text-[#4e4e4e]">
                {manga.views} FAVORITES
              </span>
              {manga.genres?.[0] && (
                <>
                  <span className="text-[#494949]">|</span>
                  <span className="text-[10px] bg-[#ffffff] shadow-sm border border-[#e7e5e4] px-2 py-1 text-[#0c0a09]  tracking-normal rounded-full">
                    {manga.genres[0]}
                  </span>
                </>
              )}
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
          onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className=" tracking-[0.15px] gap-2 rounded-2xl border-[#e7e5e4] hover:bg-[#ffffff] shadow-sm hover:text-[#0c0a09]"
        >
          <ChevronLeft className="w-4 h-4" /> PREV
        </Button>
        <span className="text-[#4e4e4e]  tracking-[0.15px] text-[14px]">
          PAGE {page} {totalPages > 1 && `OF ${totalPages}`}
        </span>
        <Button 
          variant="outline" 
          disabled={page >= totalPages}
          onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className=" tracking-[0.15px] gap-2 rounded-2xl border-[#e7e5e4] hover:bg-[#ffffff] shadow-sm hover:text-[#0c0a09]"
        >
          NEXT <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
