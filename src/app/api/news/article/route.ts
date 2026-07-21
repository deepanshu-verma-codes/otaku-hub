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
    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    if (!article) {
      throw new Error("Could not parse article");
    }

    return NextResponse.json({
      title: article.title,
      content: article.content,
      textContent: article.textContent,
      byline: article.byline,
      dir: article.dir,
      siteName: article.siteName,
    });
  } catch (error: any) {
    console.error("Failed to fetch article:", error);
    return NextResponse.json(
      { message: "Failed to fetch article", error: error.message },
      { status: 500 }
    );
  }
}
