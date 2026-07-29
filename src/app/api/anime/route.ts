import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const search = searchParams.get("search") || "";

  let query = "";
  let variables: any = { page, perPage: limit };

  if (search) {
    query = `
      query ($page: Int, $perPage: Int, $search: String) {
        Page (page: $page, perPage: $perPage) {
          pageInfo { total, lastPage }
          media (search: $search, sort: POPULARITY_DESC, type: ANIME, isAdult: false, status_not: NOT_YET_RELEASED, format_not_in: [MUSIC, SPECIAL]) {
            id title { english romaji } coverImage { extraLarge large } episodes seasonYear format status
          }
        }
      }
    `;
    variables.search = search;
  } else {
    query = `
      query ($page: Int, $perPage: Int) {
        Page (page: $page, perPage: $perPage) {
          pageInfo { total, lastPage }
          media (sort: POPULARITY_DESC, type: ANIME, isAdult: false, status_not: NOT_YET_RELEASED, format_not_in: [MUSIC, SPECIAL]) {
            id title { english romaji } coverImage { extraLarge large } episodes seasonYear format status
          }
        }
      }
    `;
  }

  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query, variables })
    });
    
    const data = await res.json();
    if (!data.data) return NextResponse.json({ message: "No data returned" }, { status: 500 });

    const items = data.data.Page.media.map((m: any) => ({
      id: m.id.toString(),
      title: m.title.english || m.title.romaji || "Unknown Anime",
      thumbnail: m.coverImage.extraLarge || m.coverImage.large,
      episodes: m.episodes || "?",
      year: m.seasonYear || "N/A",
      format: m.format || "TV",
      status: m.status || "UNKNOWN"
    }));

    return NextResponse.json({
      items, page, totalPages: data.data.Page.pageInfo.lastPage, totalItems: data.data.Page.pageInfo.total
    });
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch anime" }, { status: 500 });
  }
}
