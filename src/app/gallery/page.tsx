"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Heart, Download, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/Loader";

const categories = ["All", "Boys", "Girls", "Group", "Mecha", "Monsters", "Scenery"];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

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

  const isFavorited = (imgId: string) => {
    return favorites?.images?.some((f: any) => f.id === imgId);
  };

  const handleLike = (e: React.MouseEvent, img: any) => {
    e.stopPropagation();
    if (!session) return alert("Please sign in to save images.");
    const action = isFavorited(img.id) ? "remove" : "add";
    toggleFavorite.mutate({ type: "image", action, item: img });
  };

  const {
    data,
    isLoading,
    isFetching,
    status,
  } = useQuery({
    queryKey: ["gallery", activeCategory, debouncedSearch, page],
    queryFn: async () => {
      const res = await fetch(
        `/api/gallery?category=${encodeURIComponent(activeCategory)}&search=${encodeURIComponent(debouncedSearch)}&page=${page}&limit=20`
      );
      const data = await res.json();
      return data.items || [];
    },
    staleTime: Infinity, // keep cache for pages so going back doesn't trigger new random results
  });

  return (
    <div className="max-w-[1440px] mx-auto px-[40px] py-12 bg-[#f5f5f5] min-h-screen">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-[#e7e5e4] pb-6 mb-12">
        <h1 className="text-[36px] font-serif font-light tracking-[-0.36px] font-normal text-[#0c0a09]  leading-[1.19]">
          GALLERY
        </h1>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4e4e4e]" />
          <Input
            placeholder="SEARCH WALLPAPERS..."
            className="pl-12 bg-[#f5f5f5] border border-[#e7e5e4] rounded-2xl text-[#0c0a09] h-12  tracking-[0.15px] focus-visible:border-white focus-visible:ring-0"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-12">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            className={`rounded-2xl  tracking-[0.15px] ${
              activeCategory === cat 
                ? "" 
                : ""
            }`}
            onClick={() => {
              setActiveCategory(cat);
              setPage(1);
            }}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Grid */}
      {status === "pending" ? (
        <div className="flex justify-center py-32">
          <Loader />
        </div>
      ) : status === "error" ? (
        <div className="text-center text-[#dc2626] py-20  tracking-normal">Error loading images</div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {data?.map((img: any) => (
            <div
              key={img.url}
              className="relative group overflow-hidden cursor-pointer bg-[#ffffff] shadow-sm break-inside-avoid rounded-2xl"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img.url}
                alt={img.artist_name || "Anime Art"}
                className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#f5f5f5]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <p className="font-normal text-[#0c0a09]  text-[16px] truncate">ART BY {img.artist_name || "UNKNOWN"}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-[10px] text-[#0c0a09] bg-[#494949] px-2 py-1  tracking-[0.225px]">
                    {activeCategory}
                  </span>
                  <button 
                    className={`transition-colors ${isFavorited(img.id) ? 'text-[#dc2626]' : 'text-[#0c0a09] hover:text-[#dc2626]'}`} 
                    onClick={(e) => handleLike(e, img)}
                  >
                    <Heart className={`w-6 h-6 ${isFavorited(img.id) ? 'fill-current' : ''}`} />
                  </button>
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
          disabled={page === 1}
          onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className=" tracking-[0.15px] gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> PREV
        </Button>
        <span className="text-[#4e4e4e]  tracking-[0.15px] text-[14px]">PAGE {page}</span>
        <Button 
          variant="outline" 
          onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className=" tracking-[0.15px] gap-2"
        >
          NEXT <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f5f5f5]/90 p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.98 }}
              className="relative max-w-[1200px] w-full max-h-full flex flex-col items-center justify-center bg-[#f5f5f5] p-6 border border-[#e7e5e4] rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-6 right-6 text-[#4e4e4e] hover:text-[#0c0a09] bg-[#ffffff] shadow-sm p-3 rounded-2xl transition-all z-10"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6" />
              </button>
              
              <img
                src={selectedImage.url}
                alt={selectedImage.artist_name || "Anime Art"}
                className="max-w-full max-h-[70vh] object-contain rounded-2xl border border-[#181818]"
              />
              
              <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end mt-8 border-t border-[#e7e5e4] pt-6 gap-6">
                <div>
                  <h3 className="text-[27px] font-normal  text-[#0c0a09]">ART BY {selectedImage.artist_name || "UNKNOWN"}</h3>
                  <p className="text-[#4e4e4e]  tracking-[0.15px] mt-2">{activeCategory}</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" className="gap-2" onClick={(e) => handleLike(e, selectedImage)}>
                    <Heart className={`w-5 h-5 ${isFavorited(selectedImage.id) ? 'fill-[#dc2626] text-[#dc2626]' : ''}`} /> 
                    {(selectedImage.likes || 0) + (isFavorited(selectedImage.id) ? 1 : 0)}
                  </Button>
                  <a href={selectedImage.url} target="_blank" rel="noopener noreferrer" className={buttonVariants({ className: "gap-2" })}>
                    <Download className="w-5 h-5" /> DOWNLOAD
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
