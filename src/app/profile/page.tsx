"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          let quality = 0.9;
          let dataUrl = canvas.toDataURL("image/jpeg", quality);
          
          while (dataUrl.length > 130000 && quality > 0.1) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }

          resolve(dataUrl);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUpdating(true);
      const compressedBase64 = await compressImage(file);
      
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: compressedBase64 }),
      });

      if (res.ok) {
        await update();
        router.refresh();
      } else {
        alert("Failed to update avatar");
      }
    } catch (error) {
      console.error(error);
      alert("Error processing image");
    } finally {
      setIsUpdating(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

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
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUpdating}
              className="w-full mt-8 bg-transparent hover:bg-[#f5f5f5] text-[#0c0a09] border border-[#e7e5e4] rounded-2xl h-12 tracking-[0.15px] text-[14px]"
            >
              {isUpdating ? "UPDATING..." : "CHANGE AVATAR"}
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="p-8 bg-[#ffffff] rounded-2xl border border-[#e7e5e4] shadow-sm space-y-6">
              <h3 className="text-[14px] font-medium text-[#0c0a09] tracking-[0.15px] uppercase border-b border-[#e7e5e4] pb-4">
                ACCOUNT SETTINGS
              </h3>
              
              <div className="space-y-2 pt-2">
                <Label className="text-[12px] tracking-[0.15px] text-[#4e4e4e] uppercase">FULL NAME</Label>
                <Input defaultValue={session.user?.name || ""} className="bg-[#f5f5f5] border-[#e7e5e4] rounded-2xl text-[#0c0a09] h-12 tracking-[0.15px] focus-visible:border-white focus-visible:ring-0 uppercase" />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[12px] tracking-[0.15px] text-[#4e4e4e] uppercase">NEW PASSWORD</Label>
                <Input type="password" placeholder="LEAVE BLANK TO KEEP CURRENT PASSWORD" className="bg-[#f5f5f5] border-[#e7e5e4] rounded-2xl text-[#0c0a09] h-12 tracking-[0.15px] focus-visible:border-white focus-visible:ring-0 placeholder:text-[#a8a29e]" />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[12px] tracking-[0.15px] text-[#4e4e4e] uppercase">CONFIRM NEW PASSWORD</Label>
                <Input type="password" placeholder="CONFIRM NEW PASSWORD" className="bg-[#f5f5f5] border-[#e7e5e4] rounded-2xl text-[#0c0a09] h-12 tracking-[0.15px] focus-visible:border-white focus-visible:ring-0 placeholder:text-[#a8a29e]" />
              </div>

              <div className="pt-4">
                <Button className="w-full bg-[#0c0a09] hover:bg-[#292524] text-[#ffffff] rounded-2xl h-12 tracking-[0.15px] text-[14px]">
                  SAVE CHANGES
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
