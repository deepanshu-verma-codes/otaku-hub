import { NextResponse } from "next/server";
import { MANGA } from "@consumet/extensions";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");
    const requestedChapterId = searchParams.get("chapterId");

    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    const provider = new MANGA.WeebCentral();

    // 1. Search WeebCentral for the title
    const searchRes = await provider.search(title);

    if (!searchRes.results || searchRes.results.length === 0) {
      return NextResponse.json({ message: "Manga not found" }, { status: 404 });
    }

    const mangaId = searchRes.results[0].id;
    const mangaTitle = searchRes.results[0].title || title;

    // 2. Fetch Manga Info to get chapters
    const info = await provider.fetchMangaInfo(mangaId);

    if (!info.chapters || info.chapters.length === 0) {
      return NextResponse.json({ message: "No chapters available" }, { status: 404 });
    }

    // Sort chapters by chapter number ascending (if available) or just reverse array if it's descending
    // WeebCentral seems to provide them in descending order, but let's safely handle it.
    let sortedChapters = [...info.chapters];
    
    // Reverse it to ascending order if it looks descending
    if (sortedChapters.length > 1 && parseFloat(sortedChapters[0].id) < parseFloat(sortedChapters[1].id)) {
      // Actually IDs in WeebCentral are random strings. Let's just reverse the array if we assume it's descending.
      sortedChapters.reverse();
    } else {
      // Usually WeebCentral chapters are descending, so we reverse it.
      sortedChapters.reverse();
    }

    // Attempt to extract a clean chapter number from the title (e.g. "Chapter 10" -> "10")
    // or just use index + 1 as fallback.
    const uniqueChapters = sortedChapters.map((ch: any, index: number) => {
      let chNum = (index + 1).toString();
      if (ch.title && ch.title.toLowerCase().includes("chapter")) {
        const match = ch.title.match(/chapter\s+([\d\.]+)/i);
        if (match) chNum = match[1];
      }
      return { id: ch.id, title: ch.title, chapterNumber: chNum };
    });

    let targetChapter = null;
    if (requestedChapterId) {
      targetChapter = uniqueChapters.find((ch: any) => ch.id === requestedChapterId);
    } 
    
    if (!targetChapter) {
      targetChapter = uniqueChapters[0]; // first chapter
    }

    if (!targetChapter) {
      return NextResponse.json({ message: "Requested chapter not found" }, { status: 404 });
    }

    // 3. Get the pages for that chapter
    const pagesData = await provider.fetchChapterPages(targetChapter.id);

    if (!pagesData || pagesData.length === 0) {
      return NextResponse.json({ message: "Failed to fetch chapter pages" }, { status: 500 });
    }

    const pages = pagesData.map((p: any) => p.img || p.url);

    return NextResponse.json({
      title: mangaTitle,
      chapter: targetChapter.chapterNumber || "1",
      chapterId: targetChapter.id,
      pages,
      allChapters: uniqueChapters
    });
  } catch (error: any) {
    console.error("Failed to read manga:", error);
    return NextResponse.json(
      { message: "Failed to load manga reader", error: error.message },
      { status: 500 }
    );
  }
}
