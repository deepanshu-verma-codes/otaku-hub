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
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-medium mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
        My Favorites
      </h1>

      <Tabs defaultValue="images" className="w-full">
        <TabsList className="mb-8 bg-gray-900 border border-[#e7e5e4] rounded-xl">
          <TabsTrigger value="images" className="data-[state=active]:bg-pink-600 data-[state=active]:text-[#0c0a09] px-8">
            Images
          </TabsTrigger>
          <TabsTrigger value="videos" className="data-[state=active]:bg-pink-600 data-[state=active]:text-[#0c0a09] px-8">
            Videos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="images">
          <div className="p-10 border border-dashed border-[#e7e5e4] rounded-2xl text-center bg-gray-900/50">
            <p className="text-xl text-[#777169] mb-2">You haven't favorited any images yet.</p>
            <p className="text-sm text-[#777169]">Browse the gallery and click the heart icon to save them here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="videos">
          <div className="p-10 border border-dashed border-[#e7e5e4] rounded-2xl text-center bg-gray-900/50">
            <p className="text-xl text-[#777169] mb-2">No saved videos found.</p>
            <p className="text-sm text-[#777169]">Explore videos and AMVs and save them for later.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
