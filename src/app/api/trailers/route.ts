import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "8");

  const query = `
    query ($page: Int, $perPage: Int) {
      Page (page: $page, perPage: $perPage) {
        pageInfo {
          total
          lastPage
        }
        media (sort: POPULARITY_DESC, type: ANIME, isAdult: false) {
          id
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
    }
  `;

  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Request more items so we can filter out those without trailers and still have enough
      body: JSON.stringify({
        query: query,
        variables: { page, perPage: limit * 2 }
      })
    });
    
    const data = await res.json();
    
    if (!data.data) {
      return NextResponse.json({ message: "No data returned" }, { status: 500 });
    }

    const items = data.data.Page.media
      .filter((m: any) => m.trailer && m.trailer.site === "youtube")
      .slice(0, limit) // limit to requested amount
      .map((m: any) => {
        let cleanDescription = m.description || "No description provided.";
        // Some descriptions from Anilist have HTML tags like <br> or <i>
        cleanDescription = cleanDescription.replace(/<[^>]*>?/gm, '');
        return {
          id: m.id.toString(),
          title: m.title.english || m.title.romaji || "Unknown Anime",
          thumbnail: m.coverImage.extraLarge || m.coverImage.large,
          trailerUrl: `https://www.youtube.com/embed/${m.trailer.id.trim()}`,
          youtubeId: m.trailer.id.trim(),
          duration: "TRAILER",
          views: `${Math.floor((m.popularity || 0) / 1000)}K`,
          category: "Anime Trailer",
          synopsis: cleanDescription
        };
      });

    return NextResponse.json({
      items,
      page,
      totalPages: data.data.Page.pageInfo.lastPage,
      totalItems: data.data.Page.pageInfo.total
    });
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch trailers" }, { status: 500 });
  }
}
