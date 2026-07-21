import { NextResponse } from "next/server";
import Parser from "rss-parser";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const parser = new Parser();
    const feed = await parser.parseURL("https://www.animenewsnetwork.com/news/rss.xml");

    const start = (page - 1) * limit;
    const end = start + limit;
    const items = feed.items.slice(start, end).map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet || item.content,
      categories: item.categories || [],
    }));

    const totalPages = Math.ceil(feed.items.length / limit);

    return NextResponse.json({
      items,
      page,
      totalPages,
      totalItems: feed.items.length,
    });
  } catch (error) {
    console.error("Failed to fetch RSS:", error);
    return NextResponse.json(
      { message: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
