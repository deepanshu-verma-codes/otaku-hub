import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get("url");

    if (!targetUrl) {
      return NextResponse.json({ message: "URL is required" }, { status: 400 });
    }

    if (!targetUrl.includes("animenewsnetwork.com")) {
      return NextResponse.json({ message: "Invalid domain" }, { status: 400 });
    }

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.status}`);
    }

    const html = await response.text();
    const doc = new JSDOM(html, { url: targetUrl });
    
    const meat = doc.window.document.querySelector("div.meat");
    
    if (!meat) {
      throw new Error("Could not parse article");
    }

    // Remove unwanted widgets within meat
    const widgets = meat.querySelectorAll(".toolbox, .news-topics, .social-buttons, .comments-board, .post-footer, iframe");
    widgets.forEach(w => w.remove());

    // Fix broken images (relative paths & lazy loading)
    const images = meat.querySelectorAll("img");
    images.forEach(img => {
      let src = img.getAttribute("data-src") || img.getAttribute("src");
      if (src) {
        if (src.startsWith("/")) {
          src = "https://www.animenewsnetwork.com" + src;
        }
        img.setAttribute("src", src);
        img.removeAttribute("data-src");
        img.removeAttribute("srcset");
        
        // Ensure styling doesn't break
        img.className = "w-full rounded-2xl my-6 object-cover border border-[#e7e5e4] shadow-sm";
      }
    });

    // Strip links
    const links = meat.querySelectorAll("a");
    links.forEach(link => {
      const span = doc.window.document.createElement("span");
      span.innerHTML = link.innerHTML;
      span.className = "font-medium text-[#0c0a09]";
      link.replaceWith(span);
    });

    const cleanContent = meat.innerHTML;
    const titleMatch = doc.window.document.title.replace(" - Anime News Network", "");

    return NextResponse.json({
      title: titleMatch,
      content: cleanContent,
      textContent: meat.textContent,
      byline: "Anime News",
      dir: "ltr",
      siteName: "OtakuHub",
    });
  } catch (error: any) {
    console.error("Failed to fetch article:", error);
    return NextResponse.json(
      { message: "Failed to fetch article", error: error.message },
      { status: 500 }
    );
  }
}
