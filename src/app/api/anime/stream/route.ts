import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");
  const season = searchParams.get("s");
  const episode = searchParams.get("e");

  if (!title || !season || !episode) {
    return NextResponse.json({ message: "Missing params" }, { status: 400 });
  }

  try {
    const res = await fetch(`http://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(title)}`);
    if (!res.ok) {
      return NextResponse.json({ message: "Show not found" }, { status: 404 });
    }

    const data = await res.json();
    const imdb = data?.externals?.imdb;

    if (imdb) {
      // Using autoembed.co with IMDB ID (extremely fast and doesn't timeout like vidsrc)
      const embedUrl = `https://autoembed.co/tv/imdb/${imdb}-${season}-${episode}`;
      return NextResponse.json({ embedUrl });
    }

    return NextResponse.json({ message: "IMDB ID not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch stream" }, { status: 500 });
  }
}
