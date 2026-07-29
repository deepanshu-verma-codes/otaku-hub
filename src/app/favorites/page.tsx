"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Play } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const { data: favorites, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await fetch("/api/favorites");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: status === "authenticated",
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

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center py-20 bg-[#f5f5f5] min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0c0a09]"></div>
      </div>
    );
  }

  if (!session) return null;

  const images = favorites?.images || [];
  const trailers = favorites?.trailers || [];

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-12 pb-24">
      <div className="max-w-[1440px] mx-auto px-[40px]">
        <div className="space-y-2 mb-12 border-b border-[#e7e5e4] pb-6">
          <h1 className="text-[32px] font-serif font-light tracking-[-0.32px] font-normal uppercase text-[#0c0a09]">MY FAVORITES</h1>
          <p className="text-[#4e4e4e] tracking-[0.15px] text-[12px] uppercase">
            YOUR SAVED IMAGES AND TRAILERS
          </p>
        </div>

        <Tabs defaultValue="images" className="w-full">
          <TabsList className="mb-12 bg-[#ffffff] border border-[#e7e5e4] rounded-2xl h-12 p-1 inline-flex">
            <TabsTrigger value="images" className="data-[state=active]:bg-[#f5f5f5] data-[state=active]:text-[#0c0a09] data-[state=active]:shadow-sm rounded-xl text-[12px] tracking-[0.15px] uppercase px-8">
              IMAGES ({images.length})
            </TabsTrigger>
            <TabsTrigger value="trailers" className="data-[state=active]:bg-[#f5f5f5] data-[state=active]:text-[#0c0a09] data-[state=active]:shadow-sm rounded-xl text-[12px] tracking-[0.15px] uppercase px-8">
              TRAILERS ({trailers.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="images">
            {images.length === 0 ? (
              <div className="p-16 border border-dashed border-[#e7e5e4] rounded-2xl text-center bg-[#ffffff] shadow-sm">
                <p className="text-[14px] text-[#0c0a09] tracking-[0.15px] uppercase font-medium mb-2">YOU HAVEN'T FAVORITED ANY IMAGES YET.</p>
                <p className="text-[12px] text-[#4e4e4e] tracking-[0.15px] uppercase">BROWSE THE GALLERY AND CLICK THE HEART ICON TO SAVE THEM HERE.</p>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {images.map((img: any) => (
                  <div key={img.id} className="relative group overflow-hidden bg-[#ffffff] shadow-sm break-inside-avoid rounded-2xl">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-[#f5f5f5]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                      <p className="font-normal text-[#0c0a09] text-[14px] truncate">{img.title}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-[10px] text-[#0c0a09] bg-[#494949]/10 px-2 py-1 tracking-[0.225px] rounded">
                          {img.category}
                        </span>
                        <button 
                          onClick={() => toggleFavorite.mutate({ type: "image", action: "remove", item: img })}
                          className="text-[#dc2626] hover:text-[#0c0a09] transition-colors"
                        >
                          <Heart className="w-6 h-6 fill-current" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="trailers">
            {trailers.length === 0 ? (
              <div className="p-16 border border-dashed border-[#e7e5e4] rounded-2xl text-center bg-[#ffffff] shadow-sm">
                <p className="text-[14px] text-[#0c0a09] tracking-[0.15px] uppercase font-medium mb-2">NO SAVED TRAILERS FOUND.</p>
                <p className="text-[12px] text-[#4e4e4e] tracking-[0.15px] uppercase">EXPLORE TRAILERS AND SAVE THEM FOR LATER.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {trailers.map((trailer: any) => (
                  <div key={trailer.id} className="group relative">
                    <Link href={`/trailers/${trailer.id}`}>
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#ffffff] shadow-sm border border-[#e7e5e4] mb-4">
                        <img src={trailer.thumbnail} alt={trailer.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-[#0c0a09]/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                          <Play className="w-10 h-10 text-[#ffffff]" />
                        </div>
                      </div>
                    </Link>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-[16px] font-medium text-[#0c0a09] line-clamp-2 leading-[1.4]">
                          {trailer.title}
                        </h3>
                        <p className="text-[12px] tracking-[0.15px] text-[#4e4e4e] mt-1 uppercase">
                          {trailer.category}
                        </p>
                      </div>
                      <button 
                        onClick={() => toggleFavorite.mutate({ type: "trailer", action: "remove", item: trailer })}
                        className="text-[#dc2626] hover:text-[#0c0a09] transition-colors flex-shrink-0"
                      >
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
