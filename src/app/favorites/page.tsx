"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center py-20 bg-[#f5f5f5] min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0c0a09]"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-12 pb-24">
      <div className="max-w-[1440px] mx-auto px-[40px]">
        <div className="space-y-2 mb-12 border-b border-[#e7e5e4] pb-6">
          <h1 className="text-[32px] font-serif font-light tracking-[-0.32px] font-normal uppercase text-[#0c0a09]">MY FAVORITES</h1>
          <p className="text-[#4e4e4e] tracking-[0.15px] text-[12px] uppercase">
            YOUR SAVED IMAGES AND VIDEOS
          </p>
        </div>

        <Tabs defaultValue="images" className="w-full">
          <TabsList className="mb-12 bg-[#ffffff] border border-[#e7e5e4] rounded-2xl h-12 p-1 inline-flex">
            <TabsTrigger value="images" className="data-[state=active]:bg-[#f5f5f5] data-[state=active]:text-[#0c0a09] data-[state=active]:shadow-sm rounded-xl text-[12px] tracking-[0.15px] uppercase px-8">
              IMAGES
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-[#f5f5f5] data-[state=active]:text-[#0c0a09] data-[state=active]:shadow-sm rounded-xl text-[12px] tracking-[0.15px] uppercase px-8">
              VIDEOS
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="images">
            <div className="p-16 border border-dashed border-[#e7e5e4] rounded-2xl text-center bg-[#ffffff] shadow-sm">
              <p className="text-[14px] text-[#0c0a09] tracking-[0.15px] uppercase font-medium mb-2">YOU HAVEN'T FAVORITED ANY IMAGES YET.</p>
              <p className="text-[12px] text-[#4e4e4e] tracking-[0.15px] uppercase">BROWSE THE GALLERY AND CLICK THE HEART ICON TO SAVE THEM HERE.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="p-16 border border-dashed border-[#e7e5e4] rounded-2xl text-center bg-[#ffffff] shadow-sm">
              <p className="text-[14px] text-[#0c0a09] tracking-[0.15px] uppercase font-medium mb-2">NO SAVED VIDEOS FOUND.</p>
              <p className="text-[12px] text-[#4e4e4e] tracking-[0.15px] uppercase">EXPLORE VIDEOS AND AMVS AND SAVE THEM FOR LATER.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
