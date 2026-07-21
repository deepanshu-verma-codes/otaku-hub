import { NextResponse } from "next/server";

const dummyImages = Array.from({ length: 100 }).map((_, i) => ({
  id: `img-${i}`,
  title: `Anime Wallpaper ${i + 1}`,
  // Unsplash has nice anime/japan style images
  url: `https://images.unsplash.com/photo-${[
    "1578632767115-351597cf2477",
    "1541562232579-512a21360020",
    "1528360983277-1a523456c601",
    "1601850494422-3fb1827f736a",
    "1580477655124-b1525a1e74a8",
    "1579361661339-387cb46fdbbc",
  ][i % 6]}?q=80&w=800&auto=format&fit=crop`,
  fullUrl: `https://images.unsplash.com/photo-${[
    "1578632767115-351597cf2477",
    "1541562232579-512a21360020",
    "1528360983277-1a523456c601",
    "1601850494422-3fb1827f736a",
    "1580477655124-b1525a1e74a8",
    "1579361661339-387cb46fdbbc",
  ][i % 6]}?q=100&w=2560&auto=format&fit=crop`,
  category: ["Action", "Romance", "Isekai", "Slice of Life", "Fantasy"][i % 5],
  likes: Math.floor(Math.random() * 500),
}));

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const category = searchParams.get("category");
  const search = searchParams.get("search")?.toLowerCase();

  let filtered = dummyImages;

  if (category && category !== "All") {
    filtered = filtered.filter((img) => img.category === category);
  }

  if (search) {
    filtered = filtered.filter((img) => img.title.toLowerCase().includes(search));
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const items = filtered.slice(start, end);

  return NextResponse.json({
    items,
    nextPage: end < filtered.length ? page + 1 : null,
  });
}
