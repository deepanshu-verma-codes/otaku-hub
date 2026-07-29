import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const search = searchParams.get("search") || undefined;
  const genre = searchParams.get("genre") || undefined;
  const sort = searchParams.get("sort") || "POPULARITY_DESC";

  const query = `
    query ($page: Int, $perPage: Int, $search: String, $genre: String, $sort: [MediaSort]) {
      Page (page: $page, perPage: $perPage) {
        pageInfo {
          total
          lastPage
        }
        media (search: $search, genre: $genre, sort: $sort, type: MANGA, isAdult: false) {
          id
          title {
            english
            romaji
          }
          coverImage {
            extraLarge
            large
          }
          genres
          popularity
          description(asHtml: false)
          chapters
          volumes
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
      body: JSON.stringify({
        query: query,
        variables: { 
          page, 
          perPage: limit,
          ...(search ? { search } : {}),
          ...(genre ? { genre } : {}),
          sort: search ? ["SEARCH_MATCH", sort] : [sort]
        }
      })
    });
    
    const data = await res.json();
    
    if (!data.data) {
      return NextResponse.json({ message: "No data returned" }, { status: 500 });
    }

    const items = data.data.Page.media.map((m: any) => {
      let cleanDescription = m.description || "No description provided.";
      cleanDescription = cleanDescription.replace(/<[^>]*>?/gm, '');
      return {
        id: m.id.toString(),
        title: m.title.english || m.title.romaji || "Unknown Manga",
        thumbnail: m.coverImage.extraLarge || m.coverImage.large,
        genres: m.genres || [],
        views: `${Math.floor((m.popularity || 0) / 1000)}K`,
        synopsis: cleanDescription,
        chapters: m.chapters || 'Ongoing'
      };
    });

    return NextResponse.json({
      items,
      page,
      totalPages: data.data.Page.pageInfo.lastPage,
      totalItems: data.data.Page.pageInfo.total
    });
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch manga" }, { status: 500 });
  }
}
