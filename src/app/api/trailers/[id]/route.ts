import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const query = `
    query ($id: Int) {
      Media (id: $id, type: ANIME) {
        id
        idMal
        episodes
        title {
          english
          romaji
        }
        coverImage {
          extraLarge
          large
        }
        trailer {
          id
          site
        }
        popularity
        description(asHtml: false)
      }
    }
  `;

  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: { id: parseInt(id) }
      })
    });
    
    const data = await res.json();

    if (!data.data || !data.data.Media) {
      return NextResponse.json({ message: "Trailer not found" }, { status: 404 });
    }

    const m = data.data.Media;
    let cleanDescription = m.description || "No description provided.";
    cleanDescription = cleanDescription.replace(/<[^>]*>?/gm, '');

    const trailer = {
      id: m.id.toString(),
      title: m.title.english || m.title.romaji || "Unknown Anime",
      thumbnail: m.coverImage.extraLarge || m.coverImage.large,
      trailerUrl: m.trailer && m.trailer.site === "youtube" ? `https://www.youtube.com/watch?v=${m.trailer.id.trim()}` : null,
      youtubeId: m.trailer && m.trailer.site === "youtube" ? m.trailer.id.trim() : null,
      duration: "TRAILER",
      views: `${Math.floor((m.popularity || 0) / 1000)}K`,
      category: "Anime",
      synopsis: cleanDescription,
      episodes: m.episodes || 12,
      idMal: m.idMal
    };

    return NextResponse.json(trailer);
  } catch(err) {
    return NextResponse.json({ message: "Error fetching trailer" }, { status: 500 });
  }
}
