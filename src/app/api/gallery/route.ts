import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const category = searchParams.get("category");
  const search = searchParams.get("search")?.toLowerCase();

  // Safebooru uses 0-indexed pagination
  const pid = page - 1;
  let tags = "highres"; // default tag to get good quality images

  if (search) {
    tags = search.replace(/\s+/g, '_');
  } else if (category && category !== "All") {
    // Map standard categories to Safebooru tags
    const categoryMap: Record<string, string> = {
      "Boys": "1boy rating:safe",
      "Girls": "1girl rating:safe",
      "Group": "rating:safe multiple_girls",
      "Mecha": "mecha rating:safe",
      "Monsters": "monster rating:safe",
      "Scenery": "scenery rating:safe"
    };
    tags = categoryMap[category] || tags;
  }

  try {
    const res = await fetch(`https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&limit=${limit}&pid=${pid}&tags=${encodeURIComponent(tags)}`, {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error("Failed to fetch from Safebooru");
    
    const data = await res.json();
    
    const items = data.map((img: any) => {
      // Safebooru sometimes omits the domain in older API versions, but usually includes it now. Ensure it's absolute.
      const getAbsoluteUrl = (url: string) => url?.startsWith('http') ? url : `https://safebooru.org/${url?.replace(/^\//, '')}`;
      
      return {
        id: img.id.toString(),
        title: img.tags.split(" ").slice(0, 3).join(" ").toUpperCase(),
        url: getAbsoluteUrl(img.sample_url || img.file_url),
        fullUrl: getAbsoluteUrl(img.file_url),
        category: category || "All",
        likes: img.score || Math.floor(Math.random() * 500),
      };
    });

    return NextResponse.json({
      items,
      nextPage: data.length === limit ? page + 1 : null,
    });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch gallery images" }, { status: 500 });
  }
}
