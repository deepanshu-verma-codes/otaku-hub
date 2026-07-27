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
          <h1 className="text-[32px] font-serif font-light tracking-[-0.32px] font-normal uppercase text-[#0c0a09]">PROFILE</h1>
          <p className="text-[#4e4e4e] tracking-[0.15px] text-[12px] uppercase">
            MANAGE YOUR ACCOUNT SETTINGS AND PREFERENCES
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Avatar */}
          <div className="flex flex-col items-center p-8 bg-[#ffffff] rounded-2xl border border-[#e7e5e4] w-full md:w-1/3 shadow-sm h-fit">
            <Avatar className="w-32 h-32 border border-[#e7e5e4] mb-6">
              <AvatarImage src={session.user?.image || ""} />
              <AvatarFallback className="text-[32px] font-serif bg-[#f5f5f5] text-[#0c0a09] font-light">{session.user?.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <h2 className="text-[18px] tracking-normal font-medium text-[#0c0a09] uppercase">{session.user?.name}</h2>
            <p className="text-[#4e4e4e] text-[12px] tracking-[0.15px] mt-2 uppercase">{session.user?.email}</p>
            
            <Button className="w-full mt-8 bg-transparent hover:bg-[#f5f5f5] text-[#0c0a09] border border-[#e7e5e4] rounded-2xl h-12 tracking-[0.15px] text-[14px]">
              CHANGE AVATAR
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="settings" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#ffffff] border border-[#e7e5e4] rounded-2xl h-12 p-1">
                <TabsTrigger value="settings" className="data-[state=active]:bg-[#f5f5f5] data-[state=active]:text-[#0c0a09] data-[state=active]:shadow-sm rounded-xl text-[12px] tracking-[0.15px] uppercase">
                  ACCOUNT SETTINGS
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-[#f5f5f5] data-[state=active]:text-[#0c0a09] data-[state=active]:shadow-sm rounded-xl text-[12px] tracking-[0.15px] uppercase">
                  WATCH HISTORY
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="settings" className="mt-8 p-8 bg-[#ffffff] rounded-2xl border border-[#e7e5e4] shadow-sm space-y-6">
                <div className="space-y-2">
                  <Label className="text-[12px] tracking-[0.15px] text-[#4e4e4e] uppercase">USERNAME</Label>
                  <Input defaultValue={session.user?.name || ""} className="bg-[#f5f5f5] border-[#e7e5e4] rounded-2xl text-[#0c0a09] h-12 tracking-[0.15px] focus-visible:border-white focus-visible:ring-0 uppercase" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[12px] tracking-[0.15px] text-[#4e4e4e] uppercase">BIO</Label>
                  <Textarea 
                    placeholder="TELL US ABOUT YOUR FAVORITE ANIME..." 
                    className="bg-[#f5f5f5] border-[#e7e5e4] rounded-2xl text-[#0c0a09] tracking-[0.15px] focus-visible:border-white focus-visible:ring-0 min-h-[120px] p-4 resize-none uppercase"
                    defaultValue="I LOVE ACTION AND ISEKAI ANIME! MY TOP 3 ARE..."
                  />
                </div>
                <div className="pt-4">
                  <Button className="w-full bg-[#0c0a09] hover:bg-[#292524] text-[#ffffff] rounded-2xl h-12 tracking-[0.15px] text-[14px]">
                    SAVE CHANGES
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="mt-8 p-12 bg-[#ffffff] rounded-2xl border border-[#e7e5e4] shadow-sm flex items-center justify-center min-h-[300px]">
                <p className="text-[#4e4e4e] text-[12px] tracking-[0.15px] uppercase text-center">
                  YOUR WATCH HISTORY WILL APPEAR HERE.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
