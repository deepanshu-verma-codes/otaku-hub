import type { Metadata } from "next";
import { Inter, EB_Garamond } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ebGaramond = EB_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "OtakuHub - Modern Anime Destination",
  description: "Your ultimate hub for anime wallpapers, videos, and news.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${ebGaramond.variable} font-sans min-h-screen bg-[#f5f5f5] text-[#0c0a09] antialiased selection:bg-[#0c0a09] selection:text-[#ffffff] relative`}
      >
        <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center opacity-[0.05] -z-10 grayscale pointer-events-none" />
        <Providers>
          <div className="flex min-h-screen flex-col relative z-0">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
