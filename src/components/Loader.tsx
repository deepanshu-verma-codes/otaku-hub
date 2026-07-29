import React from "react";

export default function Loader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center space-y-6 ${className}`}>
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Outer elegant spinning ring */}
        <div className="absolute inset-0 rounded-full border border-[#e7e5e4] border-t-[#0c0a09] border-r-[#0c0a09] animate-[spin_1.5s_linear_infinite]"></div>
        <div className="absolute inset-1 rounded-full border border-transparent border-b-[#4e4e4e] animate-[spin_2s_ease-in-out_infinite_reverse]"></div>
        
        {/* Inner logo pulsing */}
        <img 
          src="/logo.jpg" 
          alt="Loading..." 
          className="w-6 h-6 animate-pulse" 
          style={{ filter: "drop-shadow(0px 0px 4px rgba(12, 10, 9, 0.1))" }}
        />
      </div>
      <p className="font-serif tracking-[0.2em] text-[#0c0a09] text-[11px] font-medium animate-pulse">LOADING</p>
    </div>
  );
}
