"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Loader from "@/components/Loader";

const decodeBase64Url = (str: string) => {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    return decodeURIComponent(atob(base64));
  } catch (e) {
    return null;
  }
};

export default function NewsArticlePage() {
  const params = useParams();
  const router = useRouter();
  
  // ID is url-safe base64 encoded URL to make it a safe path parameter
  const encodedId = params.id as string;
  const decodedUrl = encodedId ? decodeBase64Url(encodedId) : null;

  const { data: articleData, isLoading, isError } = useQuery({
    queryKey: ["article", decodedUrl],
    queryFn: async () => {
      if (!decodedUrl) return null;
      const res = await fetch(`/api/news/article?url=${encodeURIComponent(decodedUrl)}`);
      if (!res.ok) throw new Error("Failed to fetch article");
      return res.json();
    },
    enabled: !!decodedUrl,
    staleTime: Infinity,
  });

  return (
    <div className="max-w-[1300px] mx-auto px-[24px] md:px-[40px] py-12 md:py-20 bg-[#f5f5f5] min-h-screen">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#4e4e4e] hover:text-[#0c0a09] transition-colors mb-12 tracking-[0.15px] font-medium"
      >
        <ArrowLeft className="w-5 h-5" /> BACK TO NEWS
      </button>

      {isLoading ? (
        <div className="flex justify-center py-32">
          <Loader />
        </div>
      ) : isError || !articleData ? (
        <div className="text-center py-32 text-[#dc2626]">
          <p>Failed to load article content.</p>
          {decodedUrl && (
            <a href={decodedUrl} target="_blank" rel="noopener noreferrer" className="text-[#0c0a09] underline mt-4 inline-block">
              Read on Original Website
            </a>
          )}
        </div>
      ) : (
        <article className="w-full">
          <header className="mb-12 border-b border-[#e7e5e4] pb-8">
            <h1 className="text-[32px] md:text-[48px] font-serif font-light text-[#0c0a09] leading-[1.1] mb-6 tracking-[-0.96px]">
              {articleData.title}
            </h1>
            {articleData.byline && (
              <p className="text-[#4e4e4e] text-[16px] tracking-[0.15px]">
                By {articleData.byline}
              </p>
            )}
            {articleData.siteName && !articleData.byline && (
              <p className="text-[#4e4e4e] text-[16px] tracking-[0.15px]">
                Source: {articleData.siteName}
              </p>
            )}
          </header>
          
          <div 
            className="prose prose-neutral max-w-none text-[#4e4e4e] text-[16px] md:text-[18px] leading-[1.8] prose-headings:text-[#0c0a09] prose-headings:font-serif prose-headings:font-light prose-a:text-[#0c0a09] prose-img:rounded-xl prose-img:border prose-img:border-[#e7e5e4]"
            dangerouslySetInnerHTML={{ __html: articleData.content }}
          />
        </article>
      )}
    </div>
  );
}
