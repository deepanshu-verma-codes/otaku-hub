"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "SOMETHING WENT WRONG");
      }

      router.push("/auth/signin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-md bg-[#ffffff] shadow-sm border border-[#e7e5e4] text-[#0c0a09] p-8 rounded-xl">
        <div className="space-y-2 mb-8 text-center border-b border-[#e7e5e4] pb-6">
          <h1 className="text-[32px] font-serif font-light tracking-[-0.32px] font-normal  tracking-normal">SIGN UP</h1>
          <p className="text-[#4e4e4e]  tracking-[0.15px] text-[12px]">
            CREATE AN ACCOUNT TO JOIN THE NETWORK
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-[#ffffff] text-[12px]  tracking-normal font-medium text-center bg-[#ff3333] p-3 rounded-2xl">{error}</div>}
          
          <div className="space-y-2">
            <Label htmlFor="name" className=" text-[12px] tracking-[0.15px] text-[#4e4e4e]">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="YOUR CALLSIGN"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#f5f5f5] border border-[#e7e5e4] rounded-2xl text-[#0c0a09] h-12  tracking-[0.15px] focus-visible:border-white focus-visible:ring-0 placeholder:text-[#494949]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className=" text-[12px] tracking-[0.15px] text-[#4e4e4e]">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="PILOT@UNIVERSE.COM"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#f5f5f5] border border-[#e7e5e4] rounded-2xl text-[#0c0a09] h-12  tracking-[0.15px] focus-visible:border-white focus-visible:ring-0 placeholder:text-[#494949]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className=" text-[12px] tracking-[0.15px] text-[#4e4e4e]">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#f5f5f5] border border-[#e7e5e4] rounded-2xl text-[#0c0a09] h-12 tracking-[0.15px] focus-visible:border-white focus-visible:ring-0"
              required
              minLength={6}
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#0c0a09] hover:bg-[#292524] text-[#ffffff] rounded-2xl h-12  tracking-[0.15px] text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "PROCESSING..." : "CREATE ACCOUNT"}
          </Button>
        </form>
        
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#e7e5e4]" />
          </div>
          <div className="relative flex justify-center text-[10px] tracking-normal ">
            <span className="bg-[#ffffff] shadow-sm px-4 text-[#4e4e4e] rounded-xl">OR CONTINUE WITH</span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          type="button" 
          className="w-full bg-transparent border-[#e7e5e4] hover:bg-[#ffffff] shadow-sm text-[#0c0a09] rounded-2xl h-12  tracking-[0.15px] text-[14px]"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          GOOGLE
        </Button>
        
        <div className="mt-8 pt-6 border-t border-[#e7e5e4] text-[12px] text-center w-full text-[#4e4e4e]  tracking-[0.15px]">
          ALREADY HAVE AN ACCOUNT?{" "}
          <Link href="/auth/signin" className="text-[#0c0a09] hover:text-[#0c0a09] transition-colors ml-1">
            LOG IN
          </Link>
        </div>
      </div>
    </div>
  );
}
