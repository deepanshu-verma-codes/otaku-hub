"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-medium mb-8 text-[#0c0a09]">Your Profile</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar / Avatar */}
        <div className="flex flex-col items-center p-6 bg-gray-900 rounded-2xl border border-[#e7e5e4] w-full md:w-1/3">
          <Avatar className="w-32 h-32 border-4 border-purple-500/50 mb-4">
            <AvatarImage src={session.user?.image || ""} />
            <AvatarFallback className="text-4xl">{session.user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-medium">{session.user?.name}</h2>
          <p className="text-[#777169]">{session.user?.email}</p>
          
          <Button className="w-full mt-6 bg-white/10 hover:bg-white/20 text-[#0c0a09] border-0">
            Change Avatar
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900 border border-[#e7e5e4] rounded-xl">
              <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600 data-[state=active]:text-[#0c0a09]">
                Account Settings
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-purple-600 data-[state=active]:text-[#0c0a09]">
                Watch History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings" className="mt-6 p-6 bg-gray-900 rounded-2xl border border-[#e7e5e4] space-y-6">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input defaultValue={session.user?.name || ""} className="bg-[#f5f5f5]/50 border-[#e7e5e4]" />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea 
                  placeholder="Tell us about your favorite anime..." 
                  className="bg-[#f5f5f5]/50 border-[#e7e5e4] min-h-[100px]"
                  defaultValue="I love Action and Isekai anime! My top 3 are..."
                />
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-[#0c0a09]">
                Save Changes
              </Button>
            </TabsContent>
            
            <TabsContent value="history" className="mt-6 p-6 bg-gray-900 rounded-2xl border border-[#e7e5e4]">
              <p className="text-[#777169] text-center py-10">Your watch history will appear here.</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
